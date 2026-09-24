# lista-tarefas-react

A mesma lista de tarefas do [lista-tarefas-web](https://github.com/Thi4goVcs/lista-tarefas-web), agora em React e conversando com a [todo-api](https://github.com/Thi4goVcs/todo-api) em vez de guardar tudo no `localStorage`. Cria, marca como feita, apaga, filtra (todas / pendentes / feitas).

Sexto projeto do portfólio. Queria sentir a diferença entre montar a tela na mão (DOM puro, projeto anterior) e deixar o React cuidar de re-renderizar quando o estado muda. Também foi minha primeira vez ligando um front num back que eu mesmo fiz.

## Rodando

Precisa da [todo-api](https://github.com/Thi4goVcs/todo-api) rodando em outro terminal, na porta 8000:

```bash
# num terminal, dentro do todo-api
uvicorn main:app --reload
```

```bash
# noutro terminal, aqui
git clone https://github.com/Thi4goVcs/lista-tarefas-react.git
cd lista-tarefas-react
npm install
npm run dev
```

Abre o endereço que o Vite mostrar (`http://localhost:5173`).

## Por que precisou mexer na API também

A todo-api não tinha CORS liberado — só respondia pra quem chamasse do mesmo endereço/porta dela. Um front rodando em `localhost:5173` chamando uma API em `localhost:8000` conta como origem diferente pro navegador, então tive que voltar lá e adicionar `CORSMiddleware` liberando essa porta. Rodei os testes da API de novo depois disso pra confirmar que não quebrei nada.

## Como testei de verdade

Subi os dois servidores (API + front) e usei a tela como um usuário usaria: criei tarefa, marquei como feita, apaguei, troquei de filtro. Conferi na aba de rede que cada ação disparava a chamada certa (`POST`, `PUT`, `DELETE`) e que o número de pendentes batia com o que a API tinha guardado — não só "parece certo na tela".

## Estrutura

- `src/api.js` — todas as chamadas HTTP num lugar só, separadas dos componentes. Se um dia trocar a URL da API ou adicionar autenticação, mexo só aqui.
- `src/App.jsx` — o estado da lista e os três handlers (criar, alternar, apagar). Sem gerenciador de estado externo, só `useState`/`useEffect` — não precisava de mais que isso pra esse tamanho de projeto.

## Limite que conheço

Se a API estiver fora do ar, a tela mostra uma mensagem de erro, mas não tenta de novo sozinha — precisa recarregar a página depois de subir a API.
