# Framework de Automação de Testes de API: ServeRest

Framework de automação de testes de API da [ServeRest](https://serverest.dev), desenvolvido pela equipe QAtapimbas na Jala University, na disciplina de Engenharia de Qualidade de Software 3.

## Tecnologias

Node.js, Jest, ESLint e Prettier.

## Arquitetura

O projeto é dividido em quatro camadas. Cada camada só conhece a que está logo abaixo dela.

| Camada       | Pasta          | Responsabilidade                   |
| ------------ | -------------- | ---------------------------------- |
| Testes       | `tests`        | Cenários e asserções               |
| Serviços     | `src/services` | Operações de negócio da API        |
| Núcleo       | `src/core`     | Request Manager, logger e contexto |
| Configuração | `src/config`   | Ambientes e dados                  |

Detalhes e diagrama em [docs/arquitetura.md](docs/arquitetura.md).

## Como executar

```bash
git clone https://github.com/JoaoGomes-se/framework-automacao-ServeRest.git
cd framework-automacao-ServeRest
npm install
npm test
```

## Qualidade de código

```bash
npm run lint
npm run format
```

Regras do linter e registro da última execução em [docs/qualidade-de-codigo.md](docs/qualidade-de-codigo.md). As [convenções de uso do logger](docs/convencoes-logger.md) definem os níveis, o formato e os dados permitidos nos logs.

## Como contribuir

Veja [CONTRIBUTING.md](CONTRIBUTING.md).

## Equipe

João Victor Gomes de Araújo, Jônatas Pereira da Silva, Kaio De Jesus Dias e Enio Martins.
