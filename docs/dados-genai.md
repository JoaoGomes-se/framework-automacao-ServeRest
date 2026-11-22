# Conjuntos de Dados Dinâmicos com GenAI (Atividade 4.3)

Este documento registra o processo de geração, revisão e validação de massas de dados de borda (*edge cases*) com apoio de IA generativa para os módulos `/usuarios` e `/produtos` da API ServeRest.

## 1. Prompt Completo Utilizado

```text
Você é um engenheiro de QA especializado em testes de API REST.
Preciso de dois conjuntos de dados em formato JSON para testar a API ServeRest:
1) Endpoint POST /usuarios (campos: nome, email, password, administrador)
2) Endpoint POST /produtos (campos: nome, preco, descricao, quantidade)

Gere 6 casos de teste de borda para cada endpoint cobrindo obrigatoriamente:
- campos vazios;
- valores extremos (ex.: 0, negativos, números muito altos);
- textos longos (ex.: 255 caracteres);
- caracteres especiais e acentuação.

Para cada item, retorne um objeto com:
- "caso": identificador curto em snake_case
- "descricao": objetivo do caso
- "payload": objeto exato para envio na requisição
- "statusEsperado": código HTTP esperado (201 ou 400)

Restrições:
- Não utilize dados pessoais reais (use apenas e-mails sintéticos no domínio @qatest.com).
- Mantenha a compatibilidade com o contrato da ServeRest.
```

## 2. Passo a Passo do Procedimento

1. **Definição dos contratos:** Foram levantados os campos obrigatórios e tipos aceitos pelos endpoints `/usuarios` e `/produtos` na documentação oficial da ServeRest (`https://serverest.dev`).
2. **Execução do prompt na IA:** O prompt acima foi submetido para gerar os dois arquivos JSON iniciais.
3. **Revisão técnica e adequação à ServeRest:** Cada payload gerado foi inspecionado manualmente antes de ser salvo no repositório.
4. **Armazenamento no framework:** Os conjuntos revisados foram salvos em:
   - [src/data/usuarios.edge.json](file:///c:/Users/J/Jala%20University/Qualidade%20de%20Software%203/Repo/framework-automacao-ServeRest/src/data/usuarios.edge.json)
   - [src/data/produtos.edge.json](file:///c:/Users/J/Jala%20University/Qualidade%20de%20Software%203/Repo/framework-automacao-ServeRest/src/data/produtos.edge.json)

## 3. Revisões e Correções Feitas na Saída da IA

Durante a revisão manual dos dados gerados pela IA, foram aplicados os seguintes ajustes:

| Arquivo | Problema identificado na saída da IA | Correção aplicada |
| --- | --- | --- |
| `usuarios.edge.json` | O campo `administrador` foi gerado inicialmente como booleano (`true` / `false`) em alguns itens. | Na ServeRest, `administrador` é validado como string (`"true"` ou `"false"`). Todos os casos válidos foram convertidos para string, mantendo `"sim"` apenas no caso negativo específico. |
| `usuarios.edge.json` | A IA sugeriu e-mails com domínios comuns (`@gmail.com` / `@example.com`). | Padronizados para `@qatest.com` com prefixo sintético, seguindo a convenção de não usar dados pessoais reais. |
| `produtos.edge.json` | O campo `preco` foi gerado como número decimal (`99.99`) em um dos casos. | A ServeRest exige `preco` como número **inteiro** positivo (`integer`). O valor foi ajustado para inteiro (`350`). |
| `produtos.edge.json` | A IA gerou `preco: 0` esperando `201`. | Na regra da ServeRest, `preco` deve ser positivo (`>= 1`). O `statusEsperado` foi corrigido para `400`. |
