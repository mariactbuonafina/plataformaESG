import React, { useState } from "react";
import "./Avaliacao.css";

const Avaliacao = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [progress, setProgress] = useState(17); // Exemplo de progresso
  const [currentQuestion, setCurrentQuestion] = useState(1);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (currentQuestion < 6) {
      setCurrentQuestion(currentQuestion + 1);
      setProgress((currentQuestion + 1) * (100 / 6));
      setSelectedOption(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
      setProgress((currentQuestion - 1) * (100 / 6));
      setSelectedOption(null);
    }
  };

  return (
    <div className="avaliacao-container">
      {/* Cabeçalho */}
      <header className="avaliacao-header">
        <button className="btn-voltar">← Voltar</button>

        <div className="titulo">
          <h2>Avaliação ESG</h2>
          <p>
            Pergunta {currentQuestion} de 6 • {currentQuestion - 1} respondidas
          </p>
        </div>

        <div className="progresso-geral">
          <h3>{Math.round(progress)}%</h3>
          <p>Progresso</p>
        </div>
      </header>

      {/* Barra de progresso */}
      <section className="progresso-avaliacao">
        <h4>Progresso da Avaliação</h4>
        <div className="barra">
          <div
            className="preenchimento"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="categorias">
          <span>Governança</span>
          <span>Ambiental</span>
          <span>Social</span>
        </div>
        <span className="contador">0/6 questões</span>
      </section>

      {/* Card da pergunta */}
      <div className="card-pergunta">
        <div className="card-header">
          <img
            src="https://img.icons8.com/ios-filled/50/0043ff/survey.png"
            alt="Governança"
            className="icon"
          />
          <div>
            <p className="categoria">GOVERNANÇA</p>
            <p className="questao">Questão {currentQuestion}</p>
          </div>
        </div>

        <h3 className="titulo-pergunta">
          Sua empresa possui código de ética implementado?
        </h3>

        <div className="opcoes">
          <label
            className={`opcao ${
              selectedOption === "Sim" ? "selecionado verde" : ""
            }`}
          >
            <input
              type="radio"
              name="resposta"
              value="Sim"
              onChange={() => handleOptionSelect("Sim")}
            />
            <span>✔ Sim</span>
          </label>

          <label
            className={`opcao ${
              selectedOption === "Parcialmente" ? "selecionado laranja" : ""
            }`}
          >
            <input
              type="radio"
              name="resposta"
              value="Parcialmente"
              onChange={() => handleOptionSelect("Parcialmente")}
            />
            <span>— Parcialmente</span>
          </label>

          <label
            className={`opcao ${
              selectedOption === "Não" ? "selecionado vermelho" : ""
            }`}
          >
            <input
              type="radio"
              name="resposta"
              value="Não"
              onChange={() => handleOptionSelect("Não")}
            />
            <span>✖ Não</span>
          </label>
        </div>

        <div className="botoes-navegacao">
          <button className="btn anterior" onClick={handlePrevious}>
            ← Anterior
          </button>
          <button className="btn proxima" onClick={handleNext}>
            Próxima →
          </button>
        </div>

        {/* Indicadores de progresso */}
        <div className="indicadores">
          <div className={`bolinha ${currentQuestion === 1 ? "ativa" : ""}`} />
          <div className={`bolinha ${currentQuestion === 2 ? "ativa" : ""}`} />
          <div className={`bolinha ${currentQuestion === 3 ? "ativa" : ""}`} />
          <div className={`bolinha ${currentQuestion === 4 ? "ativa" : ""}`} />
          <div className={`bolinha ${currentQuestion === 5 ? "ativa" : ""}`} />
          <div className={`bolinha ${currentQuestion === 6 ? "ativa" : ""}`} />
        </div>
      </div>
    </div>
  );
};

export default Avaliacao;
