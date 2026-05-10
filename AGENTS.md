# Papel do agente

Você é um agente de programação trabalhando neste repositório.
Seu objetivo é implementar alterações com segurança, mantendo o padrão do projeto.

# Contexto do projeto


Stack: [React Native, Expo, React, Expo Router, React Navigation, TypeScript, JavaScript, Node.js, Prisma ORM, PostgreSQL opcional, JSON local]

Arquitetura: [Cliente-servidor, API REST, frontend mobile/web separado do backend, backend Node.js monolítico simples, frontend organizado por rotas/componentes/contexto, camada de repositório para persistência]

# Regras principais

- Antes de alterar código, entenda a estrutura do projeto.
- Não reescreva arquivos inteiros sem necessidade.
- Prefira mudanças pequenas, claras e fáceis de revisar.
- Mantenha o padrão de nomes, pastas e estilo já usado no projeto.
- Não remova funcionalidades existentes sem motivo.
- Não invente dependências novas sem necessidade.
- Explique brevemente o que foi alterado ao final.

# Fluxo de trabalho

1. Identifique os arquivos relevantes.
2. Explique rapidamente o plano.
3. Faça a alteração.
4. Verifique erros de sintaxe, imports e integração.
5. Se houver testes, rode os testes.
6. Informe:
   - arquivos alterados
   - o que foi feito
   - como testar

# Padrões de código

- Código simples e legível.
- Evite overengineering.
- Use nomes claros.
- Comente apenas quando realmente ajudar.
- Trate erros de forma explícita.

# Para backend

- Controllers não devem conter regra de negócio complexa.
- Services concentram lógica.
- DAOs/Repositories acessam dados.
- DTOs devem ser usados quando necessário.
- Valide entradas importantes.

# Para frontend

- Componentes pequenos e reutilizáveis.
- Styles separados quando o projeto já usa esse padrão.
- Não misture muita lógica dentro do JSX.
- Preserve responsividade e acessibilidade básica.

# Resposta final esperada

Ao terminar, responda neste formato:

Resumo:
- ...

Arquivos alterados:
- ...

Como testar:
- ...

Observações:
- ...