const fs = require("fs");
const path = require("path");

const HTTP_LINE_REGEX =
  /^(GET|POST|PUT|DELETE|PATCH)\s+(\S+)\s+finalizado com status\s+(\d{3})\s+em\s+(\d+(?:\.\d+)?)ms/i;

/**
 * Faz o parse de uma linha de log nos formatos:
 * - 4 campos: timestamp | NIVEL | modulo | mensagem
 * - 5 campos: timestamp | NIVEL | modulo | cenario | mensagem
 * @param {string} line
 * @returns {object|null}
 */
function parseLogLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const parts = trimmed.split("|").map((part) => part.trim());
  if (parts.length < 4) return null;

  const [timestamp, level, mod] = parts;
  const hasScenario = parts.length >= 5;
  const scenario = hasScenario ? parts[3] : "-";
  const message = hasScenario ? parts.slice(4).join(" | ") : parts[3];

  return {
    timestamp,
    level: level.toUpperCase(),
    module: mod || "geral",
    scenario: scenario || "-",
    message,
  };
}

/**
 * Faz o parse de todo o conteúdo de um arquivo de log.
 * @param {string} content
 * @returns {Array<object>}
 */
function parseLogContent(content) {
  if (!content) return [];
  return content
    .split(/\r?\n/)
    .map(parseLogLine)
    .filter((entry) => entry !== null);
}

/**
 * Resume métricas de execução, status de testes e tempos de resposta.
 * @param {Array<object>} entries
 * @returns {object}
 */
function summarizeLogs(entries) {
  const levelCounts = { INFO: 0, WARN: 0, ERROR: 0, DEBUG: 0 };
  const requests = [];
  const byModule = {};
  const byStatus = {};

  let started = 0;
  let passed = 0;
  let failed = 0;

  for (const entry of entries) {
    if (Object.prototype.hasOwnProperty.call(levelCounts, entry.level)) {
      levelCounts[entry.level] += 1;
    }

    const httpMatch = entry.message.match(HTTP_LINE_REGEX);
    if (httpMatch) {
      const method = httpMatch[1].toUpperCase();
      const endpoint = httpMatch[2];
      const status = Number(httpMatch[3]);
      const durationMs = Number(httpMatch[4]);

      requests.push({
        timestamp: entry.timestamp,
        module: entry.module,
        method,
        endpoint,
        status,
        durationMs,
      });

      byStatus[status] = (byStatus[status] || 0) + 1;

      if (!byModule[entry.module]) {
        byModule[entry.module] = { count: 0, totalMs: 0, maxMs: 0 };
      }
      byModule[entry.module].count += 1;
      byModule[entry.module].totalMs += durationMs;
      if (durationMs > byModule[entry.module].maxMs) {
        byModule[entry.module].maxMs = durationMs;
      }
      continue;
    }

    if (/\b(iniciado|iniciando)\b/i.test(entry.message)) {
      started += 1;
    } else if (
      entry.level === "ERROR" ||
      /\b(reprovado|falhou)\b/i.test(entry.message)
    ) {
      failed += 1;
    } else if (
      /\b(aprovado|passou)\b/i.test(entry.message) ||
      (/cen[aá]rio/i.test(entry.message) && /sucesso/i.test(entry.message))
    ) {
      passed += 1;
    }
  }

  const durations = requests.map((req) => req.durationMs);
  const totalRequests = requests.length;
  const avgMs =
    totalRequests > 0
      ? Number((durations.reduce((acc, d) => acc + d, 0) / totalRequests).toFixed(2))
      : 0;
  const minMs = totalRequests > 0 ? Math.min(...durations) : 0;
  const maxMs = totalRequests > 0 ? Math.max(...durations) : 0;

  const moduleStats = Object.entries(byModule).map(([mod, data]) => ({
    module: mod,
    count: data.count,
    avgMs: Number((data.totalMs / data.count).toFixed(2)),
    maxMs: data.maxMs,
  }));

  const executed = Math.max(started, passed + failed);

  return {
    totalLines: entries.length,
    levelCounts,
    scenarios: {
      executed,
      passed,
      failed,
    },
    http: {
      totalRequests,
      avgMs,
      minMs,
      maxMs,
      byStatus,
      moduleStats,
    },
  };
}

/**
 * Formata o resumo em relatório Markdown.
 * @param {object} summary
 * @param {string} sourceName
 * @returns {string}
 */
function formatMarkdownReport(summary, sourceName = "execucao.log") {
  const { scenarios, http, levelCounts, totalLines } = summary;
  const passRate =
    scenarios.executed > 0
      ? ((scenarios.passed / scenarios.executed) * 100).toFixed(1)
      : "0.0";

  const statusRows = Object.entries(http.byStatus)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([status, count]) => `| ${status} | ${count} |`)
    .join("\n");

  const moduleRows = http.moduleStats
    .map((m) => `| ${m.module} | ${m.count} | ${m.avgMs} ms | ${m.maxMs} ms |`)
    .join("\n");

  return [
    `# Relatório de Execução dos Logs`,
    ``,
    `- **Arquivo analisado:** \`${sourceName}\``,
    `- **Total de eventos no log:** ${totalLines}`,
    `- **Níveis:** INFO (${levelCounts.INFO}) | WARN (${levelCounts.WARN}) | ERROR (${levelCounts.ERROR}) | DEBUG (${levelCounts.DEBUG})`,
    ``,
    `## Resumo dos Testes`,
    ``,
    `| Métrica | Valor |`,
    `| --- | --- |`,
    `| Testes executados | ${scenarios.executed} |`,
    `| Testes aprovados | ${scenarios.passed} |`,
    `| Testes reprovados | ${scenarios.failed} |`,
    `| Taxa de aprovação | ${passRate}% |`,
    ``,
    `## Tempos de Resposta HTTP`,
    ``,
    `| Métrica | Valor |`,
    `| --- | --- |`,
    `| Total de requisições | ${http.totalRequests} |`,
    `| Tempo médio | ${http.avgMs} ms |`,
    `| Menor tempo | ${http.minMs} ms |`,
    `| Maior tempo | ${http.maxMs} ms |`,
    ``,
    `### Distribuição por Status HTTP`,
    ``,
    `| Status | Quantidade |`,
    `| --- | --- |`,
    statusRows || `| - | 0 |`,
    ``,
    `### Desempenho por Módulo`,
    ``,
    `| Módulo | Requisições | Média | Máximo |`,
    `| --- | --- | --- | --- |`,
    moduleRows || `| - | 0 | 0 ms | 0 ms |`,
    ``,
  ].join("\n");
}

/**
 * Localiza os arquivos .log não vazios na pasta logs/, ordenados do mais antigo ao mais recente.
 * @param {string} logsDir
 * @returns {Array<string>}
 */
function findLogFiles(logsDir) {
  if (!fs.existsSync(logsDir)) return [];

  return fs
    .readdirSync(logsDir)
    .filter((file) => file.endsWith(".log"))
    .map((file) => {
      const fullPath = path.join(logsDir, file);
      const stat = fs.statSync(fullPath);
      return { fullPath, size: stat.size, mtime: stat.mtimeMs };
    })
    .filter((item) => item.size > 0)
    .sort((a, b) => a.mtime - b.mtime)
    .map((item) => item.fullPath);
}

/**
 * Localiza o arquivo .log não vazio mais recente na pasta logs/.
 * @param {string} logsDir
 * @returns {string|null}
 */
function findLatestLogFile(logsDir) {
  const files = findLogFiles(logsDir);
  return files.length > 0 ? files[files.length - 1] : null;
}

/**
 * Gera o arquivo de relatório em reports/ a partir de um arquivo de log.
 * @param {string} logFilePath
 * @param {string} outputDir
 * @returns {{ reportPath: string, summary: object, markdown: string }}
 */
function generateReportFromFile(logFilePath, outputDir = path.resolve(process.cwd(), "reports")) {
  const content = fs.readFileSync(logFilePath, "utf-8");
  const entries = parseLogContent(content);
  const summary = summarizeLogs(entries);
  const sourceName = path.basename(logFilePath);
  const markdown = formatMarkdownReport(summary, sourceName);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const baseName = sourceName.replace(/\.log$/i, "");
  const reportPath = path.join(outputDir, `relatorio_${baseName}.md`);
  fs.writeFileSync(reportPath, markdown, "utf-8");

  return { reportPath, summary, markdown };
}

/**
 * Gera um relatório consolidado a partir de todos os logs não vazios em logs/.
 * @param {string} logsDir
 * @param {string} outputDir
 * @returns {{ reportPath: string, summary: object, markdown: string, filesCount: number }}
 */
function generateReportFromDirectory(
  logsDir = path.resolve(process.cwd(), "logs"),
  outputDir = path.resolve(process.cwd(), "reports")
) {
  const files = findLogFiles(logsDir);
  const allEntries = files.flatMap((file) => parseLogContent(fs.readFileSync(file, "utf-8")));
  const summary = summarizeLogs(allEntries);
  const sourceLabel =
    files.length === 1
      ? path.basename(files[0])
      : `${files.length} arquivos em logs/ (${path.basename(files[0])} ... ${path.basename(files[files.length - 1])})`;
  const markdown = formatMarkdownReport(summary, sourceLabel);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const reportPath = path.join(outputDir, "relatorio_consolidado.md");
  fs.writeFileSync(reportPath, markdown, "utf-8");

  return { reportPath, summary, markdown, filesCount: files.length };
}

if (require.main === module) {
  const inputArg = process.argv[2];
  const logsDir = path.resolve(process.cwd(), "logs");

  if (inputArg) {
    const targetFile = path.resolve(process.cwd(), inputArg);
    if (!fs.existsSync(targetFile)) {
      process.stderr.write(`Arquivo de log não encontrado: ${targetFile}\n`);
      process.exitCode = 1;
    } else {
      const { reportPath } = generateReportFromFile(targetFile);
      process.stdout.write(`Relatório gerado com sucesso em: ${reportPath}\n`);
    }
  } else {
    const files = findLogFiles(logsDir);
    if (files.length === 0) {
      process.stderr.write(
        "Nenhum arquivo de log com conteúdo encontrado em logs/. Execute os testes primeiro ou informe o caminho do log.\n"
      );
      process.exitCode = 1;
    } else {
      const { reportPath, filesCount } = generateReportFromDirectory(logsDir);
      process.stdout.write(
        `Relatório consolidado (${filesCount} logs) gerado com sucesso em: ${reportPath}\n`
      );
    }
  }
}

module.exports = {
  parseLogLine,
  parseLogContent,
  summarizeLogs,
  formatMarkdownReport,
  findLogFiles,
  findLatestLogFile,
  generateReportFromFile,
  generateReportFromDirectory,
};
