# Relatório técnico do repositório `petShop`

## 1) Visão geral

O projeto é um app mobile em **React Native com Expo** (SDK 54), com dependências modernas como `react 19` e `react-native 0.81`, e suporte a navegação via **expo-router** e também via **React Navigation**. Na prática, o código atual mistura os dois padrões de roteamento. Isso indica que o projeto provavelmente começou com o template do Expo Router e depois recebeu uma implementação paralela de telas no diretório `src/pet`. 

## 2) O que existe no repositório

- Estrutura padrão de template Expo em `app/`, `components/`, `hooks/`, `constants/`.
- Uma implementação de domínio de pet shop em `src/pet`, com:
  - páginas: home, pets, donos, agendamento, histórico, criação de pet, detalhe de agendamento;
  - componentes visuais para cards e menu;
  - utilitário para geração de horários.
- Arquivo `App.jsx` com stack navigator manual.
- `package.json` com scripts básicos (`start`, `android`, `ios`, `web`, `lint`) e sem suíte de testes automatizados.

## 3) Como o sistema funciona hoje

### Fluxo funcional

1. A página Home gera intervalos de horário (`gerarHorarios`) e renderiza a agenda.
2. As demais páginas (Pets, Donos, Agendamentos, Histórico) exibem listas com `FlatList` usando dados estáticos em memória.
3. Um componente de menu (`navbar`) aparece nas telas, mas os botões ainda não navegam (`onPress={() => {}}`).

### Arquitetura de dados

- Não há backend, API, banco local ou persistência.
- Os dados estão hardcoded dentro das telas.
- Não há camada de estado global (Context, Zustand, Redux etc.).

## 4) Principais problemas identificados

1. **Conflito de arquitetura de navegação**: coexistem Expo Router e Stack Navigator clássico, sem integração clara.
2. **`App.jsx` com imports potencialmente quebrados**: referencia caminhos `./src/pages/...` que não existem no tree atual (as páginas estão em `src/pet/pages/...`).
3. **Inconsistência de estrutura e naming**: mistura de pastas TypeScript template com páginas em JSX; inclusive diretório `home.jsx/` com nome pouco convencional.
4. **Menu não funcional**: botões do navbar sem ação de navegação.
5. **Sem testes**: ausência de testes unitários, de componente e e2e.
6. **Sem validação de domínio**: entidades (pet, dono, agendamento) sem tipos/interfaces formais e sem validações.
7. **Sem persistência**: qualquer dado some ao reiniciar app.
8. **README desatualizado para o contexto real**: descreve apenas template padrão Expo, não o módulo pet shop implementado.

## 5) Recomendações de melhoria (priorizadas)

### Prioridade alta (corrigir base)

1. **Escolher um único padrão de roteamento**:
   - Opção A: migrar tudo para Expo Router (`app/`), removendo navegação duplicada.
   - Opção B: manter React Navigation em `App.jsx` e eliminar dependências/estrutura do Expo Router.
2. **Corrigir imports e estrutura de entrada do app** para garantir build limpo.
3. **Ativar navegação real no menu** (com `useNavigation` ou rotas do Expo Router, conforme decisão acima).
4. **Organizar domínio em módulos claros** (`features/pets`, `features/agendamentos` etc.).

### Prioridade média (qualidade)

5. **Introduzir tipagem consistente** (migrar JSX→TSX gradualmente, com tipos de entidades).
6. **Extrair dados mock para camada separada** (ex.: `src/pet/mocks/*.ts`) e preparar contrato de API.
7. **Criar testes mínimos**:
   - unitários para utilitários (`gerarHorarios`);
   - renderização de componentes críticos (cards/menu);
   - smoke tests de telas.
8. **Documentar projeto de verdade no README** (arquitetura, scripts, fluxo de navegação, roadmap).

### Prioridade baixa (evolução)

9. **Persistência local inicial** (AsyncStorage/SQLite) para cadastros e histórico.
10. **Estado global leve** para sincronizar agenda/pets/donos.
11. **Padronização visual e UX** (tema, feedbacks de loading/erro, vazio de lista).
12. **Pipeline de qualidade** com lint obrigatório em CI e testes em pull request.

## 6) Plano sugerido de execução

- **Sprint 1**: unificar roteamento + corrigir entrypoint + menu navegável.
- **Sprint 2**: tipagem do domínio + separação de mocks + testes base.
- **Sprint 3**: persistência local + refino UX + documentação final.

## 7) Conclusão

O repositório já possui uma boa base de interface para um app de pet shop, mas ainda está em estágio de protótipo técnico. O maior gargalo é a inconsistência estrutural (duas abordagens de navegação e possíveis imports inválidos). Ao resolver isso primeiro, fica muito mais simples evoluir para um produto estável e pronto para crescer.
