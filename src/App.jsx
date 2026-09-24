import { useEffect, useState } from "react";
import { atualizarTarefa, apagarTarefa, criarTarefa, listarTarefas } from "./api";
import "./App.css";

export default function App() {
  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [filtro, setFiltro] = useState("todas");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    listarTarefas()
      .then(setTarefas)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  async function aoSubmeter(evento) {
    evento.preventDefault();
    const valor = titulo.trim();
    if (!valor) return;

    try {
      const nova = await criarTarefa(valor);
      setTarefas((atuais) => [...atuais, nova]);
      setTitulo("");
    } catch (e) {
      setErro(e.message);
    }
  }

  async function alternar(tarefa) {
    try {
      const atualizada = await atualizarTarefa(tarefa.id, { titulo: tarefa.titulo, feita: !tarefa.feita });
      setTarefas((atuais) => atuais.map((t) => (t.id === tarefa.id ? atualizada : t)));
    } catch (e) {
      setErro(e.message);
    }
  }

  async function remover(id) {
    try {
      await apagarTarefa(id);
      setTarefas((atuais) => atuais.filter((t) => t.id !== id));
    } catch (e) {
      setErro(e.message);
    }
  }

  const tarefasFiltradas = tarefas.filter((t) => {
    if (filtro === "pendentes") return !t.feita;
    if (filtro === "feitas") return t.feita;
    return true;
  });

  if (carregando) return <p className="status">Carregando...</p>;

  return (
    <main>
      <h1>Lista de Tarefas</h1>

      {erro && (
        <p className="erro">
          {erro} — a API está rodando? (<code>uvicorn main:app --reload</code> no todo-api)
        </p>
      )}

      <form onSubmit={aoSubmeter}>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="O que precisa ser feito?"
          autoComplete="off"
        />
        <button type="submit">Adicionar</button>
      </form>

      <div className="filtros">
        {["todas", "pendentes", "feitas"].map((opcao) => (
          <button
            key={opcao}
            className={filtro === opcao ? "ativo" : ""}
            onClick={() => setFiltro(opcao)}
          >
            {opcao[0].toUpperCase() + opcao.slice(1)}
          </button>
        ))}
      </div>

      <ul>
        {tarefasFiltradas.map((tarefa) => (
          <li key={tarefa.id} className={tarefa.feita ? "feita" : ""}>
            <input type="checkbox" checked={tarefa.feita} onChange={() => alternar(tarefa)} />
            <span>{tarefa.titulo}</span>
            <button className="apagar" onClick={() => remover(tarefa.id)}>
              x
            </button>
          </li>
        ))}
      </ul>

      <p className="contador">
        {tarefas.filter((t) => !t.feita).length} pendente(s) de {tarefas.length}
      </p>
    </main>
  );
}
