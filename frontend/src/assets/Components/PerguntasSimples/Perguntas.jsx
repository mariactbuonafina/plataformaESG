import React, { useState } from "react";
import ResultadoSelo from "./ResultadoSelo";
import "./estilos/PerguntasSimples.css";

export default function PerguntasSimples() {
  const [respostas, setRespostas] = useState({});
  const [finalizado, setFinalizado] = useState(false);

  const perguntas = [
    {
      id: 1,
      texto: "Sua empresa possui código de ética implementado?",
      opcoes: ["Sim", "Parcialmente", "Não"]
    },
    {
      id: 2,
      texto: "A organização possui um sistema de gestão ambiental?",
      opcoes: ["Sim", "Parcialmente", "Não"]
    },
    {
      id: 3,
      texto: "Existem ações sociais voltadas para a comunidade local?",
      opcoes: ["Sim", "Parcialmente", "Não"]
    }
  ];

  const selecionar = (id, opcao) => {
    setRespostas({ ...respostas, [id]: opcao });
  };

  const calcularPontuacao = () => {
    let pontuacao = 0;

    Object.values(respostas).forEach((resp) => {
      if (resp === "Sim") pontuacao += 2;
      else if (resp === "Parcialmente") pontuacao += 1;
    });

    return pontuacao;
  };

  const handleEnviar = () => {
    if (Object.keys(respostas).length < perguntas.length) {
      alert("Responda todas as perguntas!");
      return;
    }
    setFinalizado(true);
  };

  if (finalizado) {
    const pontos = calcularPontuacao();
    return <ResultadoSelo pontuacao={pontos} />;
  }

  return (
    <div className="container-simples">
      <h2>Avaliação ESG</h2>

      {perguntas.map((pergunta) => (
        <div key={pergunta.id} className="card-simples">
          <p className="texto-pergunta">{pergunta.texto}</p>

          <div className="opcoes">
            {pergunta.opcoes.map((opcao) => (
              <label key={opcao} className="opcao-item">
                <input
                  type="radio"
                  name={`pergunta-${pergunta.id}`}
                  value={opcao}
                  checked={respostas[pergunta.id] === opcao}
                  onChange={() => selecionar(pergunta.id, opcao)}
                />
                {opcao}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button className="btn-enviar" onClick={handleEnviar}>
        Gerar Selo ESG
      </button>
    </div>
  );
}