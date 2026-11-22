# Framework de Automação de Testes de API: ServeRest

Framework de automação de testes para a API [ServeRest](https://serverest.dev), desenvolvido pela equipe **QAtapimbas** na Jala University (Engenharia de Qualidade de Software 3). O projeto organiza os testes em camadas desacopladas com gerenciamento centralizado de requisições, contexto compartilhado, logs estruturados, massas de dados de borda e geração de relatórios.

## Tecnologias

- **Runtime:** Node.js (CommonJS)
- **Executor e asserções:** Jest
- **Cliente HTTP:** Supertest
- **Logs:** Winston (camada de núcleo)
- **Qualidade de código:** ESLint 9 + Prettier

## Instalação e Configuração

```bash
git clone https://github.com/JoaoGomes-se/framework-automacao-ServeRest.git
cd framework-automacao-ServeRest
npm install
```

### Variáveis de Ambiente

Caso utilize arquivos `.env` (conforme `.env.example` / `.env.staging`), configure `BASE_URL`, credenciais de administrador, `REQUEST_TIMEOUT` e `LOG_LEVEL` sem expor dados sensíveis no repositório.

Para alternar o arquivo de ambiente em tempo de execução:

```powershell
# PowerShell
$env:ENV_FILE=".env.staging"; npm test
```

```bash
# Linux / CI
ENV_FILE=.env.staging npm test
```

## Execução

| Comando | Finalidade |
| --- | --- |
| `npm test` | Executa toda a suíte de testes (`--runInBand --verbose`) |
| `npm run test:unit` | Executa apenas os testes unitários (`tests/unit/`) |
| `npm run test:poc` | Executa as provas de conceito (`tests/poc/`) |
| `npm run test:migration` | Executa os testes migrados por módulo (`tests/migration/`) |
| `npm run lint` | Verifica regras de estilo e qualidade com ESLint |
| `npm run lint:fix` | Aplica correções automáticas do ESLint |
| `npm run format` | Formata o código com Prettier |
| `npm run report` | Gera relatório Markdown em `reports/` a partir do log mais recente em `logs/` |

> Para analisar um arquivo de log específico: `node src/helpers/logReport.js logs/seu-arquivo.log`.

## Componentes do Framework

### 1. Arquitetura em Camadas
O framework segue fluxo unidirecional de dependências em quatro camadas:
- **Testes (`tests/`):** cenários, pré/pós-condições e asserções Jest.
- **Serviços (`src/services/`):** operações de negócio dos endpoints (`/login`, `/usuarios`, `/produtos`, `/carrinhos`), sem asserções.
- **Núcleo (`src/core/`):** recursos transversais (`RequestManager`, `TestContext`, `logger`).
- **Configuração e Dados (`src/config/`, `src/helpers/`, `src/data/`):** parâmetros de ambiente e massas de teste.

Detalhes completos em [docs/arquitetura.md](docs/arquitetura.md).

### 2. Estrutura de Diretórios
A árvore completa comentada e o diagrama da organização de pastas estão documentados em [docs/estrutura.md](docs/estrutura.md).

### 3. Request Manager (Singleton)
Implementado em `src/core/requestManager.js`, garante uma única instância compartilhada via `RequestManager.getInstance()`, centralizando `baseUrl`, cabeçalhos padrão (`Content-Type`, `Accept`), `authToken` e os métodos HTTP (`get`, `post`, `put`, `delete`). O diagrama de classes está em [docs/singleton-request-manager.md](docs/singleton-request-manager.md).

### 4. Logger
Padronizado pelas convenções em [docs/convencoes-logger.md](docs/convencoes-logger.md), registra eventos de execução em arquivos na pasta `logs/` (ignorada pelo Git) com níveis `ERROR`, `WARN`, `INFO` e `DEBUG`, sem expor senhas ou tokens completos.

### 5. Contexto de Testes (`TestContext`)
Implementado em `src/core/context.js`, fornece armazenamento em memória (`set`, `get`, `has`, `delete`, `clear`, `all`) para compartilhar IDs, e-mails e tokens gerados dinamicamente entre etapas de um cenário e limpar o estado ao final de cada teste.

### 6. Dados de Teste
- **Dinâmicos (`src/helpers/utils.js`):** `generateUniqueEmail()` e `generateUniqueProductName()` evitam colisões no banco público da ServeRest.
- **Casos de borda com GenAI (`src/data/`):** `usuarios.edge.json` e `produtos.edge.json` reúnem cenários de campos vazios, valores extremos, textos longos e caracteres especiais. O prompt e as revisões estão em [docs/dados-genai.md](docs/dados-genai.md).

### 7. Relatório de Execução
Implementado em `src/helpers/logReport.js`, processa os logs da suíte e gera um resumo em Markdown em `reports/` com total de testes executados, aprovados, reprovados, distribuição de status HTTP e tempos de resposta (médio, mínimo e máximo). Veja um exemplo em [docs/exemplo-relatorio-logs.md](docs/exemplo-relatorio-logs.md).

## Qualidade de Código e Contribuição

- Regras de lint e histórico de verificação: [docs/qualidade-de-codigo.md](docs/qualidade-de-codigo.md)
- Fluxo de branches e revisão por pares: [CONTRIBUTING.md](CONTRIBUTING.md)

## Equipe

João Victor Gomes de Araújo, Jônatas Pereira da Silva, Kaio De Jesus Dias e Enio Martins.
