import React from "react";
import "./estilos/ResultadoSelo.css";

export default function ResultadoSelo({ pontuacao }) {
  const gerarSelo = () => {
    if (pontuacao <= 2) return "bronze";
    if (pontuacao <= 4) return "prata";
    return "ouro";
  };

  const selo = gerarSelo();

  return (
    <div className="resultado-container">
      <h2>Resultado da Avaliação</h2>

      <div className={`selo ${selo}`}>
        {selo.toUpperCase()}
      </div>

      <p className="descricao-selo">
        Sua empresa recebeu o selo <strong>{selo.toUpperCase()}</strong> com {pontuacao} pontos.
      </p>

      <button onClick={() => window.location.reload()} className="btn-voltar">
        Refazer Avaliação
      </button>
    </div>
  );
}