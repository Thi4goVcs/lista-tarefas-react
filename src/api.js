const BASE_URL = "http://127.0.0.1:8000";

async function tratarResposta(resposta) {
  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => null);
    throw new Error(corpo?.detail || `Erro ${resposta.status}`);
  }
  // DELETE devolve 204 sem corpo - não dá pra chamar .json() nesse caso
  return resposta.status === 204 ? null : resposta.json();
}

export function listarTarefas() {
  return fetch(`${BASE_URL}/tarefas`).then(tratarResposta);
}

export function criarTarefa(titulo) {
  return fetch(`${BASE_URL}/tarefas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, feita: false }),
  }).then(tratarResposta);
}

export function atualizarTarefa(id, dados) {
  return fetch(`${BASE_URL}/tarefas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  }).then(tratarResposta);
}

export function apagarTarefa(id) {
  return fetch(`${BASE_URL}/tarefas/${id}`, { method: "DELETE" }).then(tratarResposta);
}
