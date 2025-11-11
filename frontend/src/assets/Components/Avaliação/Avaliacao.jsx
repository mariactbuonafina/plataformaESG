import React, { useState, useMemo } from "react";
import "./Avaliacao.css";

// 1. Definição das Perguntas para tornar o componente dinâmico
const questionsData = [
  { id: 1, section: 'Governança', text: 'Sua empresa possui código de ética implementado?' },
  { id: 2, section: 'Governança', text: 'Existe um comitê ou responsável pela pauta ESG?' },
  { id: 3, section: 'Ambiental', text: 'A empresa monitora o consumo de recursos (água, energia)?' },
  { id: 4, section: 'Ambiental', text: 'Há um plano de gerenciamento de resíduos e descarte correto?' },
  { id: 5, section: 'Social', text: 'Sua empresa oferece treinamentos sobre diversidade e inclusão?' },
  { id: 6, section: 'Social', text: 'A empresa mede a satisfação e o bem-estar dos colaboradores?' },
];

const totalQuestions = questionsData.length;

const Avaliacao = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Índice da pergunta atual (0 a 5)
  // Novo estado para armazenar todas as respostas: { 1: 'Sim', 2: 'Parcialmente', ... }
  const [answers, setAnswers] = useState({}); 

  // Variáveis derivadas do estado
  const currentQuestion = questionsData[currentQuestionIndex];
  const selectedOption = answers[currentQuestion.id] || null; // Resposta salva para a pergunta atual
  const answeredCount = Object.keys(answers).length;

  // Lógica de Progresso (Calculado com base nas respostas)
  const progressPercentage = useMemo(() => {
    return Math.round((answeredCount / totalQuestions) * 100);
  }, [answeredCount]);

  // Handler para selecionar a opção e salvar no estado de respostas
  const handleOptionSelect = (option) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [currentQuestion.id]: option,
    }));
  };

  // Handler para avançar
  const handleNext = () => {
    // Só avança se a pergunta atual tiver uma resposta E não for a última pergunta
    if (selectedOption && currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentQuestionIndex === totalQuestions - 1) {
        // Lógica para finalizar a avaliação
        alert(`Avaliação finalizada com ${progressPercentage}% de progresso!`);
    }
  };

  // Handler para voltar
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isNextDisabled = !selectedOption && currentQuestionIndex < totalQuestions - 1; // Desabilita se não respondeu, exceto na última pergunta.
  
  // Mapeamento de cor e ícone para as opções
  const getOptionProps = (value) => {
      switch (value) {
          case 'Sim': return { icon: '✔', class: 'verde' };
          case 'Parcialmente': return { icon: '—', class: 'laranja' };
          case 'Não': return { icon: '✖', class: 'vermelho' };
          default: return { icon: '', class: '' };
      }
  };
  
  const options = ['Sim', 'Parcialmente', 'Não'];

  return (
    <div className="avaliacao-container">
      {/* Cabeçalho */}
      <header className="avaliacao-header">
        <button className="btn-voltar">← Voltar</button>

        <div className="titulo">
          <h2>Avaliação ESG</h2>
          <p>
            Pergunta {currentQuestionIndex + 1} de {totalQuestions} • {answeredCount} respondidas
          </p>
        </div>

        <h3 className="progresso-geral">{progressPercentage}%</h3>
      </header>

      {/* Barra de progresso */}
      <section className="progresso-card">
        <h4 className="card-titulo">Progresso da Avaliação</h4>
        <div className="barra-container">
          {/* A barra deve ter um segmento preenchido (Governança) e o restante vazio */}
          <div className="barra-segmento-preenchido" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <div className="categorias">
          <span>Governança</span>
          <span>Ambiental</span>
          <span>Social</span>
        </div>
        <span className="contador">{answeredCount}/{totalQuestions} questões</span>
      </section>

      {/* Card da pergunta */}
      <div className="card-pergunta">
        <div className="card-header">
          {/* Ícone é meramente ilustrativo, use SVGs ou bibliotecas de ícones */}
          <span className="categoria">{currentQuestion.section.toUpperCase()}</span>
          <p className="questao">Questão {currentQuestion.id}</p>
        </div>

        <h3 className="titulo-pergunta">{currentQuestion.text}</h3>

        <div className="opcoes">
          {options.map((optionValue) => {
            const { icon, class: colorClass } = getOptionProps(optionValue);
            const isSelected = selectedOption === optionValue;

            return (
              <label
                key={optionValue}
                className={`opcao ${isSelected ? `selecionado ${colorClass}` : ""}`}
                onClick={() => handleOptionSelect(optionValue)}
              >
                <input
                  type="radio"
                  name={`resposta-${currentQuestion.id}`} // Único por pergunta
                  value={optionValue}
                  checked={isSelected}
                  onChange={() => {}} // Lidar com o clique no label
                  className="radio-hidden" // Ocultar o radio nativo para usar o estilo customizado
                />
                <span className="opcao-texto">
                  <span className={`opcao-icon ${colorClass}`}>{icon}</span> {optionValue}
                </span>
              </label>
            );
          })}
        </div>

        {/* Footer de navegação */}
        <div className="footer-navegacao">
          <button 
            className="btn anterior" 
            onClick={handlePrevious} 
            disabled={currentQuestionIndex === 0}
          >
            ← Anterior
          </button>
          
          <div className="indicadores">
            {questionsData.map((_, index) => (
              <div 
                key={index} 
                className={`bolinha ${index === currentQuestionIndex ? "ativa" : answeredCount > index ? "respondida" : ""}`} 
                onClick={() => setCurrentQuestionIndex(index)}
              />
            ))}
          </div>
          
          <button 
            className={`btn proxima ${currentQuestionIndex === totalQuestions - 1 ? 'finalizar' : ''}`} 
            onClick={handleNext} 
            disabled={isNextDisabled}
          >
            {currentQuestionIndex === totalQuestions - 1 ? 'Finalizar' : 'Próxima →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Avaliacao;