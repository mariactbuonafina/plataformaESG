import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiConfig from '../../../src/config';
import "./UploadEvidencias.css";

const DashboardSelo = () => {
  const [seal, setSeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const apiUrl = apiConfig.API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSeal();
  }, []);

  const getAuthHeaders = () => {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchSeal = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/seals/me`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setSeal(data);
      } else if (response.status === 404) {
        setSeal(null);
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao buscar selo');
      }
    } catch (err) {
      setError('Erro ao conectar com a API');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateSeal = async () => {
    setCalculating(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/seals/calculate`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        setSeal(data);
        alert('Selo ESG calculado com sucesso!');
      } else {
        setError(data.error || 'Erro ao calcular selo');
        alert(data.error || 'Erro ao calcular selo');
      }
    } catch (err) {
      setError('Erro ao conectar com a API');
      alert('Erro ao conectar com a API');
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!seal || !seal.level) {
      alert('Primeiro é necessário calcular o selo ESG');
      return;
    }

    setDownloading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/certificates/download`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Certificado-ESG-${seal.level}-${new Date().getFullYear()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        alert('Certificado baixado com sucesso!');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao baixar certificado');
        alert(errorData.error || 'Erro ao baixar certificado');
      }
    } catch (err) {
      setError('Erro ao baixar certificado');
      alert('Erro ao baixar certificado');
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const getSealColor = (level) => {
    switch (level) {
      case 'OURO':
        return '#FFD700';
      case 'PRATA':
        return '#C0C0C0';
      case 'BRONZE':
        return '#CD7F32';
      default:
        return '#666666';
    }
  };

  const getSealEmoji = (level) => {
    switch (level) {
      case 'OURO':
        return '🏅';
      case 'PRATA':
        return '🥈';
      case 'BRONZE':
        return '🥉';
      default:
        return '🔖';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="dashboard-selo-container">
        <div className="loading">Carregando informações do selo...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-selo-container">
      <header className="dashboard-header">
        <button className="btn-voltar" onClick={() => navigate('/Home')}>
          Voltar para Home
        </button>
        <h1>Dashboard Selo ESG</h1>
      </header>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!seal ? (
        <div className="no-seal-container">
          <div className="no-seal-card">
            <h2>Nenhum Selo Encontrado</h2>
            <p>
              Para obter seu selo ESG, você precisa:
            </p>
            <ol>
              <li>Responder o questionário ESG</li>
              <li>Calcular seu selo baseado nas respostas</li>
            </ol>
            <button
              className="btn-primary btn-calculate"
              onClick={handleCalculateSeal}
              disabled={calculating}
            >
              {calculating ? 'Calculando...' : 'Calcular Selo ESG'}
            </button>
            <p className="note">
              * Certifique-se de ter respondido o questionário antes de calcular o selo.
            </p>
          </div>
        </div>
      ) : (
        <div className="seal-content">
          <div className="seal-card" style={{ borderColor: getSealColor(seal.level) }}>
            <div className="seal-header">
              <div className="seal-icon" style={{ color: getSealColor(seal.level) }}>
                {getSealEmoji(seal.level)}
              </div>
              <div className="seal-info">
                <h2>Selo ESG - {seal.level}</h2>
                <p className="seal-description">
                  {seal.level === 'OURO' && 'Certificação Ouro - Excelência em práticas ESG'}
                  {seal.level === 'PRATA' && 'Certificação Prata - Boas práticas ESG implementadas'}
                  {seal.level === 'BRONZE' && 'Certificação Bronze - Iniciando jornada ESG'}
                </p>
              </div>
            </div>

            <div className="seal-details">
              <div className="detail-item">
                <span className="detail-label">Pontuação Final:</span>
                <span className="detail-value">{seal.score_total?.toFixed(2)}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Emitido em:</span>
                <span className="detail-value">{formatDate(seal.created_at)}</span>
              </div>
              {seal.updated_at && seal.updated_at !== seal.created_at && (
                <div className="detail-item">
                  <span className="detail-label">Atualizado em:</span>
                  <span className="detail-value">{formatDate(seal.updated_at)}</span>
                </div>
              )}
            </div>

            {(seal.score_e !== undefined || seal.score_s !== undefined || seal.score_g !== undefined || seal.scores) && (
              <div className="esg-scores">
                <h3>Pontuações por Categoria</h3>
                <div className="scores-grid">
                  <div className="score-item ambiental">
                    <div className="score-label">Ambiental (E)</div>
                    <div className="score-value">{((seal.scores?.E || seal.score_e || 0).toFixed(2))}%</div>
                    <div className="score-weight">Peso: 40%</div>
                  </div>
                  <div className="score-item social">
                    <div className="score-label">Social (S)</div>
                    <div className="score-value">{((seal.scores?.S || seal.score_s || 0).toFixed(2))}%</div>
                    <div className="score-weight">Peso: 30%</div>
                  </div>
                  <div className="score-item governanca">
                    <div className="score-label">Governança (G)</div>
                    <div className="score-value">{((seal.scores?.G || seal.score_g || 0).toFixed(2))}%</div>
                    <div className="score-weight">Peso: 30%</div>
                  </div>
                </div>
                <div className="formula">
                  <strong>Fórmula:</strong> ESG = (E × 0.4) + (S × 0.3) + (G × 0.3)
                  <br />
                  <span className="formula-calculation">
                    = ({((seal.scores?.E || seal.score_e || 0).toFixed(2))} × 0.4) + ({((seal.scores?.S || seal.score_s || 0).toFixed(2))} × 0.3) + ({((seal.scores?.G || seal.score_g || 0).toFixed(2))} × 0.3)
                    <br />
                    = {seal.score_total?.toFixed(2)}%
                  </span>
                </div>
              </div>
            )}

            <div className="progress-bar-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(seal.score_total || 0, 100)}%`,
                    backgroundColor: getSealColor(seal.level)
                  }}
                ></div>
              </div>
              <div className="progress-labels">
                <span>Bronze (0-49%)</span>
                <span>Prata (50-74%)</span>
                <span>Ouro (75-100%)</span>
              </div>
            </div>

            <div className="seal-actions">
              <button
                className="btn-primary btn-calculate"
                onClick={handleCalculateSeal}
                disabled={calculating}
              >
                {calculating ? 'Recalculando...' : 'Recalcular Selo'}
              </button>
              <button
                className="btn-download"
                onClick={handleDownloadCertificate}
                disabled={downloading || !seal.level}
                style={{ backgroundColor: getSealColor(seal.level) }}
              >
                {downloading ? 'Baixando...' : 'Baixar Certificado PDF'}
              </button>
            </div>
          </div>

          <div className="info-card">
            <h3>Sobre o Selo ESG</h3>
            <ul>
              <li>
                <strong>Bronze:</strong> Empresas que estão iniciando sua jornada ESG (0-49%)
              </li>
              <li>
                <strong>Prata:</strong> Empresas com boas práticas ESG implementadas (50-74%)
              </li>
              <li>
                <strong>Ouro:</strong> Empresas com excelência em práticas ESG (75-100%)
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSelo;
