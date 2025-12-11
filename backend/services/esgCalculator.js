const SEALS_CONFIG = [
  { level: 'Bronze', minScore: 0, maxScore: 40, color: '#CD7F32', description: 'Iniciando na jornada ESG.' },
  { level: 'Prata', minScore: 41, maxScore: 75, color: '#C0C0C0', description: 'Bom engajamento com práticas ESG.' },
  { level: 'Ouro', minScore: 76, maxScore: 100, color: '#FFD700', description: 'Excelente performance e liderança em ESG.' },
];

/**
 * Calcula a pontuação total ESG com base nas respostas.
 * Fórmula: (E * 0.4) + (S * 0.3) + (G * 0.3)
 * @param {Array} responses - As respostas do usuário do banco de dados.
 * @returns {Object} - Objeto com pontuações E, S, G e total.
 */
function calculateTotalScore(responses) {
  const scores = { E: 0, S: 0, G: 0 };

  responses.forEach(response => {
    const category = response.question_key.charAt(0).toUpperCase();
    if (scores.hasOwnProperty(category)) {
      scores[category] += response.score || 0;
    }
  });

  const total = (scores.E * 0.4) + (scores.S * 0.3) + (scores.G * 0.3);

  return {
    total: Math.round(total),
    E: scores.E,
    S: scores.S,
    G: scores.G,
  };
}

/**
 * Determina o selo ESG com base na pontuação total.
 * @param {number} totalScore - A pontuação total calculada.
 * @returns {Object} - Informações sobre o selo correspondente.
 */
function calculateSeal(totalScore) {
  const seal = SEALS_CONFIG.find(s => totalScore >= s.minScore && totalScore <= s.maxScore);
  
  // Retorna um selo padrão caso nenhum seja encontrado
  return seal || { level: 'Não classificado', minScore: 0, maxScore: 100, color: '#808080', description: 'Pontuação fora do intervalo.' };
}

module.exports = {
  calculateTotalScore,
  calculateSeal,
};