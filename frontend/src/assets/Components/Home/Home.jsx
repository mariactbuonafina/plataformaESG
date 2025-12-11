
import { useState } from "react";
import "./Home.css";
import folhaIcon from "../img/folha-inicio.png";
import evidenciaIcon from "../img/evidencia.png";
import certificadoIcon from "../img/certificado.png";
import questionarioIcon from "../img/questionario.png";
import socIcon from "../img/soc.png";
import govIcon from "../img/gov.png";
import ambIcon from "../img/amb.png"


const Home = () => {
  const [progress, setProgress] = useState(0);
  const isQuestionarioConcluido = progress >= 60;
  const handleStartAvaliacao = () => {
setProgress((prev) => Math.min(prev + 20, 100));
};


  return (
    <div className="home-page">
      {/* ======= Cabeçalho ======= */}
      <header className="home-header">
        <div className="header-left">
          <div>
            <h2 className="greeting">
            <img src={folhaIcon} alt="Folha ESG" className="folha-icon" />
                Olá, Petrobras! <span>👋</span>
                </h2>

            <p className="subtitle">Continue sua jornada ESG</p>
          </div>
        </div>
        <div className="header-buttons">
          <button className="btn">Sair</button>
        </div>
      </header>

      {/* ======= Progresso ======= */}
      <section className="progress-section">
        <div className="progress-content">
          <h3>Progresso da Certificação ESG</h3>
          <p>Você está no caminho certo!</p>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="progress-info">
            <span>Questionário • Evidências • Certificado</span>
            <span className="progress-value">{progress}% Completado</span>
          </div>
        </div>
      </section>

      {/* ======= Categorias ESG ======= */}
      <section className="categories">
        <div className="category green">
          <img src={govIcon} alt="Governança" />
          <h4 className="Gov">Governança</h4>
          <p>Transparência e ética</p>
        </div>
        <div className="category blue">
          <img src={ambIcon} alt="Ambiental" />
          <h4 className="Amb">Ambiental</h4>
          <p>Sustentabilidade</p>
        </div>
        <div className="category purple">
          <img src={socIcon} alt="Social" />
          <h4 className="Soc">Social</h4>
          <p>Responsabilidade social</p>
        </div>
      </section>

      {/* ======= Cards ======= */}
      <section className="cards">
        {/* Card 1 */}
        <div className="card">
          <div className="card-header">
            <div className="icon blue-icon">
              <img src={questionarioIcon} alt="Folha ESG" className="iconsCard"/>
            </div>
            <div>
              <h4 className="TituloCard1">Questionário ESG</h4>
              <span className="status pending">Pendente</span>
            </div>
          </div>
          <p>
            Responda perguntas detalhadas sobre governança, meio ambiente e
            responsabilidade social da sua empresa.
          </p>
          <button className="btn-primary"onClick={handleStartAvaliacao}>Começar Avaliação</button>
        </div>

        {/* Card 2 */}
        <div className="card disabled">
          <div className="card-header">
            <div className="icon gray-icon">
              <img src={evidenciaIcon} alt="Folha ESG" className="iconsCard"/>
            </div>
            <div>
              <h4 className="TituloCard2"> Evidências</h4>
              <span className="status locked">Bloqueado</span>
            </div>
          </div>
          <p>
            Faça upload de documentos que comprovem suas práticas sustentáveis e
            de responsabilidade social.
          </p>
          <button className= {isQuestionarioConcluido ? "btn-primary" : "btn-disabled" } disabled = {!isQuestionarioConcluido}>
            Enviar Documentos
          </button>
          <p className="note">Complete o questionário primeiro para desbloquear</p>
        </div>

        {/* Card 3 */}
        <div className="card disabled">
          <div className="card-header">
            <div className="icon gray-icon">
              <img src={certificadoIcon} alt="Folha ESG" className="iconsCard"/>
            </div>
            <div>
              <h4 className="TituloCard3">Certificado ESG</h4>
              <span className="status locked">Bloqueado</span>
            </div>
          </div>
          <p>
            Gere seu certificado oficial ESG e compartilhe suas conquistas com
            stakeholders.
          </p>
          <button className= {progress === 100 ? "btn-primary" : "btn-disabled"}  disabled = {progress !== 100}>
            Gerar Certificado
          </button>
          <p className="note">Complete o questionário primeiro para desbloquear</p>
        </div>
      </section>

      {/* ======= Rodapé ======= */}
      <footer className="home-footer">
        &copy; {new Date().getFullYear()} Empresa ESG • Todos os direitos
        reservados.
      </footer>
    </div>
  );
};

export default Home;