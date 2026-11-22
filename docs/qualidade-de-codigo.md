# Qualidade de código

O projeto usa ESLint 9 com configuração flat em `eslint.config.js`, junto das regras recomendadas do JavaScript e do plugin do Jest. O Prettier é integrado para desativar regras de formatação que poderiam conflitar.

## Regras da equipe

- `no-unused-vars`: erro; remova variáveis e imports não utilizados.
- `no-console`: aviso; prefira o logger do projeto em vez de chamadas diretas ao console.
- `eqeqeq`: erro; use comparações estritas (`===` e `!==`).
- `prefer-const`: erro; declare com `const` quando a variável não precisar ser reatribuída.
- Regras recomendadas do Jest: aplicadas aos arquivos de teste em `tests/**/*.test.js`.
- `node_modules/`, `logs/`, `reports/` e `coverage/` são ignorados.

## Comando

Execute a verificação com:

```bash
npm run lint
```

O comando `npm run lint:fix` aplica correções automáticas disponíveis. Revise o diff antes de mantê-las.

## Registro de execução

- **Data:** 22/11/2026
- **Comando:** `npm run lint`
- **Resultado:** concluído com código de saída `0`, sem erros ou avisos.
