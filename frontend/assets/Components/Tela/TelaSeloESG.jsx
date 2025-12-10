import { useEffect, useState } from 'react';
import apiConfig from '../../../src/config';
import './TelaSeloEsg.css';

const TelaSeloESG = ({ empresaId, dashboardData, onCertificateGenerated }) => {
  const [calculation, setCalculation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const apiUrl = apiConfig.API_URL;

  useEffect(() => {
    if (dashboardData?.calculations) {
      setCalculation(dashboardData.calculations);
      setLoading(false);
    } else {
      fetchCalculation();
    }
  }, [dashboardData]);

  const fetchCalculation = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/esg/dashboard/${empresaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Erro ao buscar cálculo');

      const data = await response.json();
      if (data.data.calculations) {
        setCalculation(data.data.calculations);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      setGenerating(true);
      const response = await fetch(`/api/esg/certificado/${empresaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Erro ao gerar certificado');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificado-esg-${empresaId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar certificado:', error);
      setError(error.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleCalculateSeal = async () => {
    try {
      setGenerating(true);
      const response = await fetch('/api/esg/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ empresaId })
      });

      if (!response.ok) throw new Error('Erro ao calcular selo');

      const data = await response.json();
      if (data.data) {
        setCalculation(data.data);
        if (onCertificateGenerated) onCertificateGenerated();
      }
    } catch (err) {
      console.error('Erro ao calcular selo:', err);
      setError(err.message || 'Erro ao calcular selo');
    } finally {
      setGenerating(false);
    }
  };

  const handleShare = async () => {
    const certificateUrl = `${window.location.origin}/certificado/${empresaId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meu Certificado ESG',
          text: `Confira meu certificado ESG com o selo ${calculation?.seal}!`,
          url: certificateUrl
        });
      } catch (err) {
        console.log('Erro ao compartilhar:', err);
      }
    } else {
      // Fallback: copiar para clipboard
      navigator.clipboard.writeText(certificateUrl);
      alert('Link copiado para a área de transferência!');
    }
  };

  const handleNewAssessment = () => {
    window.location.href = '/dashboard-esg';
  };

  const getSealColor = (seal) => {
    const colors = {
      'Ouro': '#FFD700',
      'Prata': '#C0C0C0',
      'Bronze': '#CD7F32'
    };
    return colors[seal] || '#999';
  };

  const getSealEmoji = (seal) => {
    const emojis = {
      'Ouro': '🥇',
      'Prata': '🥈',
      'Bronze': '🥉'
    };
    return emojis[seal] || '🏅';
  };

  if (loading) return <div className="loading">Carregando dados...</div>;

  if (error) return <div className="error">Erro: {error}</div>;

  if (!calculation) {
    return (
      <div className="no-calculation">
        <h3>Nenhuma certificação gerada ainda</h3>
        <p>Complete o questionário e faça upload das evidências para gerar sua certificação.</p>
      </div>
    );
  }

  const details = typeof calculation.details === 'string'
    ? JSON.parse(calculation.details)
    : calculation.details;

  return (
    <div className="tela-selo-esg-container">
      <h2>Sua Certificação ESG</h2>

      {/* Cartão do Selo */}
      <div className="seal-card">
        <div className="seal-container">
          <div
            className="seal-circle"
            style={{ borderColor: getSealColor(calculation.seal) }}
          >
            <span className="seal-emoji">{getSealEmoji(calculation.seal)}</span>
            <h3 className="seal-name" style={{ color: getSealColor(calculation.seal) }}>
              {calculation.seal}
            </h3>
          </div>
        </div>

        {/* Score */}
        <div className="score-section">
          <div className="score-display">
            <span className="score-number">{calculation.score}</span>
            <span className="score-total">/100</span>
          </div>
          <p className="score-label">Sua pontuação ESG</p>
        </div>
      </div>

      {/* Detalhes */}
      <div className="details-section">
        <h3>Detalhes da Avaliação</h3>
        <div className="details-grid">
          <div className="detail-card positive">
            <span className="detail-icon">✓</span>
            <div className="detail-content">
              <p className="detail-label">Respostas Positivas</p>
              <p className="detail-value">{details.positivas || 0}</p>
            </div>
          </div>
          <div className="detail-card partial">
            <span className="detail-icon">◐</span>
            <div className="detail-content">
              <p className="detail-label">Respostas Parciais</p>
              <p className="detail-value">{details.parciais || 0}</p>
            </div>
          </div>
          <div className="detail-card negative">
            <span className="detail-icon">✕</span>
            <div className="detail-content">
              <p className="detail-label">Respostas Negativas</p>
              <p className="detail-value">{details.negativas || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Progresso por Categoria */}
      <div className="progress-by-category">
        <h3>Progresso por Categoria</h3>
        <div className="categories">
          {['Governança', 'Ambiental', 'Social'].map(category => {
            const categoryScore = Math.floor(Math.random() * 40) + 40; // Simulado
            return (
              <div key={category} className="category-progress">
                <div className="category-header">
                  <span className="category-name">{category}</span>
                  <span className="category-score">{categoryScore}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${categoryScore}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="action-buttons">
        <button
          className="btn btn-calc"
          onClick={handleCalculateSeal}
          disabled={generating}
        >
          {generating ? '⏳ Calculando...' : '🧮 Calcular Selo ESG'}
        </button>
        <button
          className="btn btn-download"
          onClick={handleDownloadCertificate}
          disabled={generating || !calculation}
        >
          {generating ? '⏳ Gerando...' : '📥 Baixar Certificado'}
        </button>
        <button className="btn btn-share" onClick={handleShare} disabled={!calculation}>
          📤 Compartilhar
        </button>
        <button className="btn btn-new-assessment" onClick={handleNewAssessment}>
          🔄 Nova Avaliação
        </button>
      </div>

      {/* Data de Emissão */}
      <div className="emission-date">
        <p>
          Emitido em {new Date(calculation.created_at).toLocaleDateString('pt-BR')}
        </p>
      </div>
    </div>
  );
};

export default TelaSeloESG;