# Exemplo de Relatório Gerado a partir dos Logs (Atividade 3.3)

Este exemplo ilustra a saída gerada pela rotina `src/helpers/logReport.js` (`npm run report`) ao processar um arquivo de log da pasta `logs/`.

## Log de Entrada (amostra)

```text
2026-11-22 14:15:10 | INFO | login | Login com credenciais válidas | Cenário iniciado
2026-11-22 14:15:10 | INFO | login | POST /login finalizado com status 200 em 321ms
2026-11-22 14:15:10 | INFO | login | Login com credenciais válidas | Cenário aprovado
2026-11-22 14:15:11 | INFO | usuarios | Cadastro de usuário único | Cenário iniciado
2026-11-22 14:15:12 | INFO | usuarios | POST /usuarios finalizado com status 201 em 415ms
2026-11-22 14:15:12 | INFO | usuarios | Cadastro de usuário único | Cenário aprovado
2026-11-22 14:15:13 | INFO | produtos | Cadastro sem token | Cenário iniciado
2026-11-22 14:15:13 | WARN | produtos | POST /produtos finalizado com status 401 em 367ms
2026-11-22 14:15:13 | INFO | produtos | Cadastro sem token | Cenário aprovado
2026-11-22 14:15:14 | INFO | carrinhos | Cadastro de carrinho | Cenário iniciado
2026-11-22 14:15:14 | INFO | carrinhos | POST /carrinhos finalizado com status 201 em 348ms
2026-11-22 14:15:14 | INFO | carrinhos | Cadastro de carrinho | Cenário aprovado
```

## Relatório Gerado (`reports/relatorio_execucao_2026-11-22_14-15-10.md`)

```markdown
# Relatório de Execução dos Logs

- **Arquivo analisado:** `execucao_2026-11-22_14-15-10.log`
- **Total de eventos no log:** 12
- **Níveis:** INFO (11) | WARN (1) | ERROR (0) | DEBUG (0)

## Resumo dos Testes

| Métrica | Valor |
| --- | --- |
| Testes executados | 4 |
| Testes aprovados | 4 |
| Testes reprovados | 0 |
| Taxa de aprovação | 100.0% |

## Tempos de Resposta HTTP

| Métrica | Valor |
| --- | --- |
| Total de requisições | 4 |
| Tempo médio | 362.75 ms |
| Menor tempo | 321 ms |
| Maior tempo | 415 ms |

### Distribuição por Status HTTP

| Status | Quantidade |
| --- | --- |
| 200 | 1 |
| 201 | 2 |
| 401 | 1 |

### Desempenho por Módulo

| Módulo | Requisições | Média | Máximo |
| --- | --- | --- | --- |
| login | 1 | 321 ms | 321 ms |
| usuarios | 1 | 415 ms | 415 ms |
| produtos | 1 | 367 ms | 367 ms |
| carrinhos | 1 | 348 ms | 348 ms |
```
