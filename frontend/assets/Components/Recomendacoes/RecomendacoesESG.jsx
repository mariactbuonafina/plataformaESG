import { useEffect, useState } from 'react';
import apiConfig from '../../../src/config';
import './Recomendacoes.css';

const RecomendacoesESG = ({ empresaId }) => {
  const [recomendacoes, setRecomendacoes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

    const apiUrl = apiConfig.API_URL;
  

  useEffect(() => {
    fetchRecomendacoes();
  }, []);

  const fetchRecomendacoes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/esg/recomendacoes/${empresaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Erro ao buscar recomendações');

      const data = await response.json();
      setRecomendacoes(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDicasESG = () => {
    return [
      {
        titulo: 'Governança Corporativa',
        dicas: [
          'Estabeleça conselhos independentes',
          'Implemente políticas de compliance',
          'Aumente transparência em relatórios',
          'Revise políticas regularmente'
        ],
        cor: 'blue'
      },
      {
        titulo: 'Responsabilidade Ambiental',
        dicas: [
          'Reduza emissões de carbono',
          'Implemente reciclagem',
          'Use energias renováveis',
          'Monitore pegada ecológica'
        ],
        cor: 'green'
      },
      {
        titulo: 'Responsabilidade Social',
        dicas: [
          'Promova diversidade e inclusão',
          'Melhore bem-estar dos colaboradores',
          'Apoie comunidades locais',
          'Implemente programas sociais'
        ],
        cor: 'purple'
      }
    ];
  };

  if (loading) return <div className="loading">Carregando recomendações...</div>;

  if (error) return <div className="error">Erro: {error}</div>;

  return (
    <div className="recomendacoes-esg-container">
      <h2>Recomendações ESG & Próximos Passos</h2>

      {recomendacoes && (
        <>
          {/* Recomendações por Selo */}
          <div className="seal-recommendations">
            <h3>Recomendações para {recomendacoes.sealAtual}</h3>
            <div className="recommendation-list">
              {recomendacoes.recomendacoesPorSelo.map((rec, index) => (
                <div key={index} className="recommendation-item">
                  <span className="recommendation-icon">→</span>
                  <p>{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recomendações Gerais */}
          <div className="general-recommendations">
            <h3>Recomendações Gerais de ESG</h3>
            <div className="recommendation-list">
              {recomendacoes.recomendacoesGerais.map((rec, index) => (
                <div key={index} className="recommendation-item">
                  <span className="recommendation-icon">✓</span>
                  <p>{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Dicas ESG */}
      <div className="tips-section">
        <h3>Dicas ESG Detalhadas</h3>
        <div className="tips-grid">
          {getDicasESG().map((categoria, index) => (
            <div key={index} className={`tip-card tip-${categoria.cor}`}>
              <h4>{categoria.titulo}</h4>
              <ul>
                {categoria.dicas.map((dica, idx) => (
                  <li key={idx}>{dica}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Próximos Passos */}
      <div className="next-steps">
        <h3>Próximos Passos</h3>
        <div className="steps-timeline">
          <div className="timeline-item">
            <div className="timeline-number">1</div>
            <div className="timeline-content">
              <h4>Revisar Recomendações</h4>
              <p>Estude as recomendações acima e prioritze as ações</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-number">2</div>
            <div className="timeline-content">
              <h4>Implementar Mudanças</h4>
              <p>Comece com as ações de maior impacto</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-number">3</div>
            <div className="timeline-content">
              <h4>Documentar Evidências</h4>
              <p>Reúna e organize documentações das implementações</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-number">4</div>
            <div className="timeline-content">
              <h4>Reavaliação</h4>
              <p>Realize uma nova avaliação para verificar progresso</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="quick-actions">
        <h3>Ações Rápidas</h3>
        <div className="action-buttons">
          <button className="action-btn">
            📊 Gerar Relatório Completo
          </button>
          <button className="action-btn">
            📧 Enviar Recomendações por Email
          </button>
          <button className="action-btn">
            🔄 Agendar Reavaliação
          </button>
          <button className="action-btn">
            💾 Salvar Recomendações
          </button>
        </div>
      </div>

      {/* Contato para Suporte */}
      <div className="support-section">
        <h3>Precisa de Ajuda?</h3>
        <p>Entre em contato conosco para consultoria especializada em ESG</p>
        <button className="btn-support">📞 Contatar Especialista</button>
      </div>
    </div>
  );
};

export default RecomendacoesESG;