const {
  parseLogLine,
  parseLogContent,
  summarizeLogs,
  formatMarkdownReport,
} = require("../../src/helpers/logReport");

describe("Atividade 3.3 - Gerador de Relatório dos Logs (Jônatas)", () => {
  const sampleLog = [
    "2026-11-22 14:10:01 | INFO | login | Autenticação admin | Cenário iniciado",
    "2026-11-22 14:10:01 | INFO | login | POST /login finalizado com status 200 em 320ms",
    "2026-11-22 14:10:01 | INFO | login | Autenticação admin | Cenário aprovado",
    "2026-11-22 14:10:02 | INFO | usuarios | Cadastro de usuário | Cenário iniciado",
    "2026-11-22 14:10:03 | WARN | usuarios | POST /usuarios finalizado com status 400 em 480ms",
    "2026-11-22 14:10:03 | ERROR | usuarios | Cadastro de usuário | Cenário reprovado",
  ].join("\n");

  test("Deve fazer o parse de linhas com 4 e 5 colunas", () => {
    const line4 = parseLogLine(
      "2026-11-22 14:10:01 | INFO | login | POST /login finalizado com status 200 em 320ms"
    );
    const line5 = parseLogLine(
      "2026-11-22 14:10:01 | INFO | login | Autenticação admin | Cenário aprovado"
    );

    expect(line4).toEqual({
      timestamp: "2026-11-22 14:10:01",
      level: "INFO",
      module: "login",
      scenario: "-",
      message: "POST /login finalizado com status 200 em 320ms",
    });

    expect(line5).toEqual({
      timestamp: "2026-11-22 14:10:01",
      level: "INFO",
      module: "login",
      scenario: "Autenticação admin",
      message: "Cenário aprovado",
    });
  });

  test("Deve resumir testes executados, aprovados, reprovados e tempos de resposta", () => {
    const entries = parseLogContent(sampleLog);
    const summary = summarizeLogs(entries);

    expect(summary.totalLines).toBe(6);
    expect(summary.scenarios).toEqual({
      executed: 2,
      passed: 1,
      failed: 1,
    });
    expect(summary.http.totalRequests).toBe(2);
    expect(summary.http.avgMs).toBe(400);
    expect(summary.http.minMs).toBe(320);
    expect(summary.http.maxMs).toBe(480);
    expect(summary.http.byStatus).toEqual({ 200: 1, 400: 1 });
  });

  test("Deve formatar o relatório em Markdown com as seções esperadas", () => {
    const entries = parseLogContent(sampleLog);
    const summary = summarizeLogs(entries);
    const markdown = formatMarkdownReport(summary, "execucao_teste.log");

    expect(markdown).toContain("# Relatório de Execução dos Logs");
    expect(markdown).toContain("| Testes executados | 2 |");
    expect(markdown).toContain("| Testes aprovados | 1 |");
    expect(markdown).toContain("| Testes reprovados | 1 |");
    expect(markdown).toContain("| Tempo médio | 400 ms |");
  });
});
