import { useEffect, useState } from 'react';
import apiConfig from '../../../src/config';
import './Questionario.css';

const Questionario = ({ dashboardData, onResponsesSaved, empresaId }) => {
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = apiConfig.API_URL;

  // Questões ESG padrão
  const perguntas = [
    {
      categoria: 'Governança',
      perguntas: [
        { id: 'gov1', texto: 'Possui Código de Conduta documentado?' },
        { id: 'gov2', texto: 'Tem política de diversidade e inclusão?' },
        { id: 'gov3', texto: 'Realiza auditoria externa de conformidade?' },
        { id: 'gov4', texto: 'Tem Conselho de Administração formalizado?' },
      ]
    },
    {
      categoria: 'Ambiental',
      perguntas: [
        { id: 'amb1', texto: 'Possui certificação ambiental (ISO 14001)?' },
        { id: 'amb2', texto: 'Tem programa de redução de emissões de carbono?' },
        { id: 'amb3', texto: 'Realiza gerenciamento de resíduos?' },
        { id: 'amb4', texto: 'Investe em energia renovável?' },
      ]
    },
    {
      categoria: 'Social',
      perguntas: [
        { id: 'soc1', texto: 'Oferece programa de capacitação para colaboradores?' },
        { id: 'soc2', texto: 'Tem política de segurança do trabalho?' },
        { id: 'soc3', texto: 'Realiza ações comunitárias e responsabilidade social?' },
        { id: 'soc4', texto: 'Oferece benefícios sociais aos colaboradores?' },
      ]
    }
  ];

  // Carregar respostas existentes
  useEffect(() => {
    if (dashboardData?.respostas) {
      setResponses(dashboardData.respostas);
    }
  }, [dashboardData]);

  // Atualizar resposta
  const handleResponseChange = (id, value) => {
    setResponses(prev => ({
      ...prev,
      [id]: value
    }));
    setSuccess(false);
  };

  // Enviar respostas
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`{${apiUrl}}/esg/form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          empresaId,
          respostas: responses
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar respostas');
      }

      const data = await response.json();
      setSuccess(true);
      
      // Chamar callback para atualizar dashboard
      if (onResponsesSaved) {
        onResponsesSaved();
      }

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Erro ao salvar respostas');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calcular preenchimento
  const totalPerguntas = perguntas.reduce((acc, cat) => acc + cat.perguntas.length, 0);
  const respondidas = Object.values(responses).filter(r => r && r !== '').length;
  const percentualPreenchimento = Math.round((respondidas / totalPerguntas) * 100);

  return (
    <div className="questionario-container">
      <div className="questionario-header">
        <h2>📋 Questionário ESG</h2>
        <div className="preenchimento-bar">
          <div 
            className="preenchimento-fill" 
            style={{ width: `${percentualPreenchimento}%` }}
          />
          <span className="preenchimento-texto">
            {respondidas}/{totalPerguntas} respondidas ({percentualPreenchimento}%)
          </span>
        </div>
      </div>

      {error && <div className="error-message">❌ {error}</div>}
      {success && <div className="success-message">✅ Respostas salvas com sucesso!</div>}

      <form onSubmit={handleSubmit} className="questionario-form">
        {perguntas.map((categoria) => (
          <div key={categoria.categoria} className="categoria-section">
            <h3 className={`categoria-titulo ${categoria.categoria.toLowerCase()}`}>
              {categoria.categoria === 'Governança' && '⚖️'}
              {categoria.categoria === 'Ambiental' && '🌱'}
              {categoria.categoria === 'Social' && '👥'}
              {' ' + categoria.categoria}
            </h3>

            <div className="perguntas-grid">
              {categoria.perguntas.map((pergunta) => (
                <div key={pergunta.id} className="pergunta-item">
                  <label className="pergunta-label">
                    {pergunta.texto}
                  </label>

                  <div className="respostas-buttons">
                    {['Sim', 'Parcialmente', 'Não'].map((opcao) => (
                      <button
                        key={opcao}
                        type="button"
                        className={`resposta-btn ${
                          responses[pergunta.id] === opcao ? 'active' : ''
                        } ${opcao.toLowerCase()}`}
                        onClick={() => handleResponseChange(pergunta.id, opcao)}
                      >
                        {opcao === 'Sim' && '✅'}
                        {opcao === 'Parcialmente' && '⚠️'}
                        {opcao === 'Não' && '❌'}
                        <span>{opcao}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="formulario-actions">
          <button 
            type="submit" 
            className="btn-salvar"
            disabled={loading || respondidas === 0}
          >
            {loading ? 'Salvando...' : '💾 Salvar Respostas'}
          </button>
          <p className="info-texto">
            {respondidas === 0 
              ? '👆 Responda pelo menos uma pergunta para salvar' 
              : `✅ Pronto para salvar! (${respondidas} respostas)`}
          </p>
        </div>
      </form>

      <div className="questionario-info">
        <h4>💡 Como Funciona?</h4>
        <ul>
          <li><strong>Sim:</strong> Você já implementou totalmente (100 pontos)</li>
          <li><strong>Parcialmente:</strong> Você está implementando (50 pontos)</li>
          <li><strong>Não:</strong> Ainda não implementou (0 pontos)</li>
        </ul>
        <p>
          Sua pontuação será calculada automaticamente após salvar. 
          Baseado no resultado você receberá um dos 3 selos ESG:
          <br/>
          <span className="selos-info">
            🥉 Bronze (0-49%) • 🥈 Prata (50-74%) • 🥇 Ouro (75-100%)
          </span>
        </p>
      </div>
    </div>
  );
};

export default Questionario;