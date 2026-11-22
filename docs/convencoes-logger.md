# Convenções de uso do logger

Estas convenções orientam os registros produzidos pelo framework durante a execução dos testes. Toda a equipe deve segui-las para que os logs sejam úteis e não exponham informações sensíveis.

## Níveis

- **`ERROR`**: ocorreu uma falha que interrompeu ou reprovou uma operação ou cenário. Registre o contexto necessário para investigar, sem incluir dados sensíveis.
- **`WARN`**: ocorreu algo inesperado que não impediu a continuação do cenário, como uma resposta válida fora do comportamento esperado para aquele passo.
- **`INFO`**: marque eventos importantes do cenário, como início, conclusão ou resultado de uma operação.
- **`DEBUG`**: detalhe técnico de requisição ou resposta necessário para investigar um problema. Use somente quando estiver depurando; não registre corpos completos nem cabeçalhos com credenciais.

## Formato das mensagens

Use uma linha por evento, nesta ordem:

```text
AAAA-MM-DD HH:mm:ss | NÍVEL | módulo | cenário | mensagem
```

Exemplo:

```text
2026-11-22 14:03:10 | INFO | produtos | cadastro de produto | Produto cadastrado com sucesso
```

- Use data e hora no fuso `America/Bahia`, nível em maiúsculas e nome de módulo curto e estável.
- Mensagens devem ser em português, objetivas, sem emojis e, quando descreverem uma ação concluída, no passado.
- Identifique o cenário em toda mensagem emitida pelos testes. Para eventos gerais do framework sem cenário associado, use `-` nesse campo.
- Os logs de transporte, quando habilitados, ficam centralizados no Request Manager e registram método HTTP, endpoint sem dados pessoais, status e duração da resposta. Os testes registram o início e o resultado dos cenários; evite duplicar detalhes de transporte.

## Dados que não podem ser registrados

Nunca registre:

- senhas, tokens completos, chaves, segredos ou credenciais;
- cabeçalhos de autenticação, como `Authorization`, sem redigi-los;
- dados pessoais reais ou corpos completos de requisição e resposta que possam contê-los.

Quando um token precisar ser reconhecido durante a depuração, registre no máximo os primeiros seis caracteres e substitua o restante por `...`. Prefira dados sintéticos nos testes. Antes de registrar uma mensagem de erro recebida da API, confira se ela não contém valores sensíveis.

## Arquivos de log

- Grave um arquivo por execução na pasta `logs/`, que deve permanecer ignorada pelo Git.
- Nomeie cada arquivo como `execucao-AAAA-MM-DD_HH-mm-ss-PID.log`, usando data e hora no fuso `America/Bahia` e o PID do processo para evitar colisões entre execuções simultâneas.
- Não armazene logs em `src/`, `tests/` ou junto dos arquivos versionados do projeto.

## Aprovação da equipe

Esta página foi preparada por João Victor Gomes de Araújo. A aprovação dos demais integrantes precisa ser registrada pela equipe; ela não foi presumida. Após a aprovação, anote abaixo os nomes e a data:

| Integrante | Aprovação | Data |
| ---------- | --------- | ---- |
|            | Pendente  |      |
|            | Pendente  |      |
|            | Pendente  |      |
