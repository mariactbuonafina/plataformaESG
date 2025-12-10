const express = require('express');
const db = require('./db');
const authenticate = require('../middlewares/auth_middleware');
const { calculateSeal, calculateTotalScore } = require('../services/esgCalculator');

const router = express.Router();

// GET selo do usuário autenticado
router.get('/me', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query('SELECT * FROM seals WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [userId]);
    
    if (result.rows.length === 0) {
      return res.json(null);
    }

    const seal = result.rows[0];
    res.json(seal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET selo por userId (mantido para compatibilidade)
router.get('/:userId', authenticate, async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query('SELECT * FROM seals WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [userId]);
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST calcular e criar/atualizar selo ESG
router.post('/calculate', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar todas as respostas do usuário
    const responsesResult = await db.query(
      'SELECT * FROM responses WHERE user_id = $1',
      [userId]
    );

    if (responsesResult.rows.length === 0) {
      return res.status(400).json({ 
        error: 'Nenhuma resposta encontrada. Complete o questionário primeiro.' 
      });
    }

    // Calcular pontuação total usando fórmula ESG: (E * 0.4) + (S * 0.3) + (G * 0.3)
    const scoreData = calculateTotalScore(responsesResult.rows);
    const totalScore = scoreData.total;
    const scoreE = scoreData.E;
    const scoreS = scoreData.S;
    const scoreG = scoreData.G;
    
    // Calcular selo baseado na pontuação total
    const sealInfo = calculateSeal(totalScore);

    // Verificar se já existe selo para este usuário
    const existingSeal = await db.query(
      'SELECT id FROM seals WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    let sealResult;

    if (existingSeal.rows.length > 0) {
      // Atualizar selo existente
      sealResult = await db.query(
        `UPDATE seals 
         SET score_total = $1, level = $2, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $3 
         RETURNING *`,
        [totalScore, sealInfo.level, existingSeal.rows[0].id]
      );
    } else {
      // Criar novo selo
      sealResult = await db.query(
        `INSERT INTO seals (user_id, score_total, level) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [userId, totalScore, sealInfo.level]
      );
    }

    const seal = sealResult.rows[0];
    
    res.json({
      ...seal,
      sealInfo: {
        level: sealInfo.level,
        color: sealInfo.color,
        description: sealInfo.description,
        minScore: sealInfo.minScore,
        maxScore: sealInfo.maxScore
      }
    });
  } catch (err) {
    console.error('Erro ao calcular selo:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;