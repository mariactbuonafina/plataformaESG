import React, { useState } from "react";
import "./Avaliacao.css";

const questionsData = [
{ id: 1, categoria: "Governança", texto: "Sua empresa possui código de ética implementado?" },
{ id: 2, categoria: "Ambiental", texto: "A empresa realiza gestão de resíduos sólidos?" },
{ id: 3, categoria: "Social", texto: "A empresa promove diversidade e inclusão?" },
{ id: 4, categoria: "Governança", texto: "A empresa tem políticas de transparência?" },
{ id: 5, categoria: "Ambiental", texto: "A empresa monitora emissões de CO₂?" },
{ id: 6, categoria: "Social", texto: "A empresa realiza ações sociais?" },
];

const Avaliacao = () => {
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [answers, setAnswers] = useState({});
const currentQuestion = questionsData[currentQuestionIndex];
const selectedOption = answers[currentQuestion.id] || null;

const handleOptionSelect = (option) => {
setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
};

const totalQuestions = questionsData.length;
const isLast = currentQuestionIndex === totalQuestions - 1;
const canGoNext = !!selectedOption && !isLast;
const canFinish = !!selectedOption && isLast;

const handleNext = () => {
if (canGoNext) setCurrentQuestionIndex((i) => i + 1);
};

const handlePrevious = () => {
if (currentQuestionIndex > 0) setCurrentQuestionIndex((i) => i - 1);
};

const handleFinish = () => {
if (!canFinish) return;
const scoreMap = { "Sim": 2, "Parcialmente": 1, "Não": 0 };
const total = questionsData.reduce(
(acc, q) => acc + (scoreMap[answers[q.id]] ?? 0),
0
);
const percent = Math.round((total / (questionsData.length * 2)) * 100);
alert(`Avaliação finalizada: ${percent}%`);
};

const progress = Math.round(((Object.keys(answers).length) / totalQuestions) * 100);

return (
<div className="avaliacao-container">
{/* Cabeçalho */}
<header className="avaliacao-header">
<button className="btn-voltar" onClick={() => setCurrentQuestionIndex(0)}>← Voltar</button>
<div className="titulo">
<h2>Avaliação ESG</h2>
<p>Pergunta {currentQuestionIndex + 1} de {totalQuestions}</p>
</div>
<div className="progresso-geral">
<h3>{progress}%</h3>
<p>Progresso</p>
</div>
</header>

{/* Barra de progresso */}
<section className="progresso-avaliacao">
<h4>Progresso da Avaliação</h4>
<div className="barra">
<div className="preenchimento" style={{ width: `${progress}%` }}></div>
</div>
</section>

{/* Card de pergunta */}
<div className="card-pergunta">
<div className="card-header">
<img
src="https://img.icons8.com/ios-filled/50/0043ff/survey.png"
alt={currentQuestion.categoria}
className="icon"
/>
<div>
<p className="categoria">{currentQuestion.categoria.toUpperCase()}</p>
<p className="questao">Questão {currentQuestion.id}</p>
</div>
</div>

<h3 className="titulo-pergunta">{currentQuestion.texto}</h3>

{/* Opções acessíveis */}
<fieldset>
<legend className="sr-only">Escolha uma opção</legend>
<div className="opcoes" role="radiogroup" aria-label={`Pergunta ${currentQuestion.id}`}>
{["Sim", "Parcialmente", "Não"].map((optionValue) => (
<label key={optionValue} className={`opcao ${selectedOption === optionValue ? "selecionado" : ""}`}>
<input
type="radio"
name={`resposta-${currentQuestion.id}`}
value={optionValue}
checked={selectedOption === optionValue}
onChange={() => handleOptionSelect(optionValue)}
/>
<span>{optionValue}</span>
</label>
))}
</div>
</fieldset>

{/* Navegação */}
<div className="footer-navegacao">
<button className="btn anterior" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
← Anterior
</button>

{!isLast ? (
<button className="btn proxima" onClick={handleNext} disabled={!canGoNext}>
Próxima →
</button>
) : (
<button className="btn proxima finalizar" onClick={handleFinish} disabled={!canFinish}>
Finalizar
</button>
)}
</div>

{/* Indicadores acessíveis */}
<div className="indicadores" role="tablist" aria-label="Navegação entre perguntas">
{questionsData.map((_, index) => (
<button
key={index}
type="button"
className={`bolinha ${index === currentQuestionIndex ? "ativa" : answers[questionsData[index].id] ? "respondida" : ""}`}
aria-current={index === currentQuestionIndex ? "step" : undefined}
onClick={() => setCurrentQuestionIndex(index)}
/>
))}
</div>
</div>
</div>
);
};

export default Avaliacao;
