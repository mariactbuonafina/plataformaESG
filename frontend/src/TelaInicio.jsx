import React from "react";
import "./TelaInicio.css";

const TelaInicio = () => {
  return (
    <div className="container">
      <div className="header">
        <h1>Progresso da Certificação ESG</h1>
        <p>Você está no caminho certo!</p>
      </div>

      {/* Barra de progresso */}
<div className="barra-progresso">
  <div className="progresso" style={{ width: "40%" }}></div>
</div>


      <div className="progress-section">
        <div className="progress-item governanca">

            <img src="src/assets/Department.png" alt="Governança" />

          <h3>Governança</h3>
          <p>Transparência e ética</p>
        </div>
        <div className="progress-item ambiental">

                  <img src="src/assets/Leaf.png" alt="Ambiental" />

          <h3>Ambiental</h3>
          <p>Sustentabilidade</p>
        </div>
        <div className="progress-item social">
                <img src="src/assets/Group Task.png" alt="Social" />

          <h3>Social</h3>
          <p>Responsabilidade social</p>
        </div>
      </div>

      

      <div className="esg-section">
        <div className="esg-item">

          <h3>Questionário ESG</h3>
          <p>
            Responda perguntas detalhadas sobre governança, meio ambiente e
            responsabilidade social da sua empresa
          </p>
          <button className="button-avaliacao">Começar Avaliação</button>
        </div>

        <div className="esg-item">
          <h3>Evidências</h3>
          <p>
            Faça upload de documentos que comprovem suas práticas sustentáveis
            e de responsabilidade social
          </p>
          <button className="button disable-doc">Enviar Documentos</button>
          <p className="note">
            Complete o questionário primeiro para atualizar.
          </p>
        </div>

        <div className="esg-item">
          <h3>Certificado ESG</h3>
          <p>
            Gere seu certificado oficial ESG e compartilhe suas conquistas com
            stakeholders
          </p>
          <button className="button disabled-evid">Gerar Certificado</button>
          <p className="note">
            Complete o questionário primeiro para desbloquear
          </p>
        </div>
      </div>
    </div>
  );
};

export default TelaInicio;
