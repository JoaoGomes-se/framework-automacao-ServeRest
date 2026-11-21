# Convenções do logger

1. **Níveis:** `error` para falhas que quebram o teste, `warn` para situações inesperadas que não quebram, `info` para cada passo importante e `debug` para detalhes de requisição e resposta, habilitado somente quando necessário.
2. **Formato:** data e hora, nível, módulo e mensagem, nesta ordem. Exemplo: `2026-11-21 14:03:10 | INFO | produtos | Produto criado com sucesso`.
3. **Quem registra:** o Request Manager registra método, endereço, status e tempo de resposta de toda requisição. Os testes registram somente o início e o resultado de cada cenário.
4. **Dados proibidos:** nunca registrar senhas, token completo ou dados pessoais reais. Se for necessário exibir um token, mostrar apenas os primeiros caracteres.
5. **Estilo:** mensagens em português, no passado, objetivas e sem emojis.
6. **Arquivos:** um arquivo por execução, com data e hora no nome, dentro da pasta `logs/`, ignorada pelo Git.
7. **Identificação:** toda mensagem emitida pelos testes inclui o nome do cenário.

## Aprovação do grupo

Pendente de validação dos integrantes. Nenhuma aprovação ou data foi presumida; registrar aqui os nomes e a data depois que o grupo aprovar as convenções.
