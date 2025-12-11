const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const authMiddleware = require('../middlewares/auth_middleware');
const esgCalculator = require('../services/esgCalculator');
const { generateESGCertificate } = require('../services/certificateGenerator');

// Configuração do multer para upload de arquivos
const uploadDir = '/app/uploads/evidencias';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const filename = `${req.userId}-${timestamp}${path.extname(file.originalname)}`;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 } });

// 1. Salvar respostas do questionário ESG
router.post('/form', authMiddleware, async (req, res) => {
  try {
    const { empresaId, respostas } = req.body;
    const userId = req.userId;

    if (!empresaId || !respostas) {
      return res.status(400).json({ error: 'empresaId e respostas são obrigatórios' });
    }

    // Salvar no banco de dados
    const query = `
      INSERT INTO esg_responses (user_id, empresa_id, respostas, created_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (user_id, empresa_id) 
      DO UPDATE SET respostas = $3, updated_at = NOW()
      RETURNING id, respostas, created_at;
    `;

    const result = await db.query(query, [userId, empresaId, JSON.stringify(respostas)]);

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erro ao salvar respostas ESG:', error);
    res.status(500).json({ error: 'Erro ao salvar respostas' });
  }
});

// 2. Upload de evidências
router.post('/evidencias/upload', authMiddleware, upload.array('files'), async (req, res) => {
  try {
    const { empresaId } = req.body;
    const userId = req.userId;

    if (!empresaId || !req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'empresaId e arquivos são obrigatórios' });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const query = `
        INSERT INTO esg_evidencias (user_id, empresa_id, file_path, file_name, file_size, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING id, file_name, file_size, created_at;
      `;

      const result = await db.query(query, [
        userId,
        empresaId,
        file.filename,
        file.originalname,
        file.size
      ]);

      uploadedFiles.push(result.rows[0]);
    }

    res.json({ success: true, files: uploadedFiles });
  } catch (error) {
    console.error('Erro ao fazer upload de evidências:', error);
    res.status(500).json({ error: 'Erro ao fazer upload' });
  }
});

// 3. Calcular selo ESG
router.post('/calculate', authMiddleware, async (req, res) => {
  try {
    const { empresaId } = req.body;
    const userId = req.userId;

    if (!empresaId) {
      return res.status(400).json({ error: 'empresaId é obrigatório' });
    }

    // Buscar respostas do usuário
    const responsesQuery = `
      SELECT respostas FROM esg_responses 
      WHERE user_id = $1 AND empresa_id = $2;
    `;

    const responsesResult = await db.query(responsesQuery, [userId, empresaId]);

    if (responsesResult.rows.length === 0) {
      return res.status(404).json({ error: 'Nenhuma resposta encontrada' });
    }

    const respostas = responsesResult.rows[0].respostas;

    // Calcular score
    const { score, seal, details } = esgCalculator.calculateScore(respostas);

    // Salvar resultado no banco
    const calculateQuery = `
      INSERT INTO esg_calculations (user_id, empresa_id, score, seal, details, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (user_id, empresa_id) 
      DO UPDATE SET score = $3, seal = $4, details = $5, updated_at = NOW()
      RETURNING *;
    `;

    const calculateResult = await db.query(calculateQuery, [
      userId,
      empresaId,
      score,
      seal,
      JSON.stringify(details)
    ]);

    res.json({ success: true, data: calculateResult.rows[0] });
  } catch (error) {
    console.error('Erro ao calcular selo ESG:', error);
    res.status(500).json({ error: 'Erro ao calcular selo' });
  }
});

// 4. Buscar dashboard ESG
router.get('/dashboard/:empresaId', authMiddleware, async (req, res) => {
  try {
    const { empresaId } = req.params;
    const userId = req.userId;

    // Buscar respostas
    const responsesQuery = `
      SELECT * FROM esg_responses 
      WHERE user_id = $1 AND empresa_id = $2;
    `;

    const responsesResult = await db.query(responsesQuery, [userId, empresaId]);

    // Buscar cálculos
    const calculationsQuery = `
      SELECT * FROM esg_calculations 
      WHERE user_id = $1 AND empresa_id = $2
      ORDER BY created_at DESC LIMIT 1;
    `;

    const calculationsResult = await db.query(calculationsQuery, [userId, empresaId]);

    // Buscar evidências
    const evidenciasQuery = `
      SELECT * FROM esg_evidencias 
      WHERE user_id = $1 AND empresa_id = $2
      ORDER BY created_at DESC;
    `;

    const evidenciasResult = await db.query(evidenciasQuery, [userId, empresaId]);

    // Calcular progresso
    let progress = 0;
    if (responsesResult.rows.length > 0) progress += 33;
    if (evidenciasResult.rows.length > 0) progress += 33;
    if (calculationsResult.rows.length > 0) progress += 34;

    res.json({
      success: true,
      data: {
        responses: responsesResult.rows[0] || null,
        calculations: calculationsResult.rows[0] || null,
        evidencias: evidenciasResult.rows || [],
        progress: progress
      }
    });
  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    res.status(500).json({ error: 'Erro ao buscar dashboard' });
  }
});

// 5. Gerar certificado PDF
router.get('/certificado/:empresaId', authMiddleware, async (req, res) => {
  try {
    const { empresaId } = req.params;
    const userId = req.userId;

    // Buscar dados de cálculo
    const calculationsQuery = `
      SELECT * FROM esg_calculations 
      WHERE user_id = $1 AND empresa_id = $2
      ORDER BY created_at DESC LIMIT 1;
    `;

    const calculationsResult = await db.query(calculationsQuery, [userId, empresaId]);

    if (calculationsResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cálculo ESG não encontrado' });
    }

    const calculation = calculationsResult.rows[0];

    // Buscar empresa
    const empresaQuery = `SELECT nome FROM empresas WHERE id = $1;`;
    const empresaResult = await db.query(empresaQuery, [empresaId]);
    const empresaNome = empresaResult.rows[0]?.nome || 'Empresa';

    // Gerar PDF
    const pdfBuffer = generateESGCertificate({
      empresaNome: empresaNome,
      score: calculation.score,
      seal: calculation.seal,
      details: calculation.details,
      dataEmissao: new Date(calculation.created_at)
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificado-esg-${empresaId}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Erro ao gerar certificado:', error);
    res.status(500).json({ error: 'Erro ao gerar certificado' });
  }
});

// 6. Listar documentos sugeridos para upload
router.get('/documentos-sugeridos', authMiddleware, (req, res) => {
  const documentosSugeridos = [
    { id: 1, titulo: 'Política de Governança', categoria: 'Governança' },
    { id: 2, titulo: 'Relatório de Sustentabilidade', categoria: 'Ambiental' },
    { id: 3, titulo: 'Código de Conduta', categoria: 'Social' },
    { id: 4, titulo: 'Certificações Ambientais', categoria: 'Ambiental' },
    { id: 5, titulo: 'Programas de Bem-estar', categoria: 'Social' },
    { id: 6, titulo: 'Políticas de Conformidade', categoria: 'Governança' },
    { id: 7, titulo: 'Auditoria Interna', categoria: 'Governança' },
    { id: 8, titulo: 'Programas de Redução de Emissões', categoria: 'Ambiental' },
    { id: 9, titulo: 'Diversidade e Inclusão', categoria: 'Social' },
    { id: 10, titulo: 'Parcerias Comunitárias', categoria: 'Social' }
  ];

  res.json({ success: true, data: documentosSugeridos });
});

// 7. Recomendações ESG
router.get('/recomendacoes/:empresaId', authMiddleware, async (req, res) => {
  try {
    const { empresaId } = req.params;
    const userId = req.userId;

    const calculationsQuery = `
      SELECT seal, details FROM esg_calculations 
      WHERE user_id = $1 AND empresa_id = $2
      ORDER BY created_at DESC LIMIT 1;
    `;

    const calculationsResult = await db.query(calculationsQuery, [userId, empresaId]);

    if (calculationsResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cálculo ESG não encontrado' });
    }

    const { seal, details } = calculationsResult.rows[0];

    const recomendacoes = {
      geral: [
        'Estabelecer metas mensuráveis de sustentabilidade',
        'Implementar sistema de gestão integrado',
        'Engajar stakeholders regularmente',
        'Realizar auditorias de conformidade'
      ],
      porSelo: {
        Bronze: [
          'Iniciar implementação de políticas básicas de ESG',
          'Treinar equipe em sustentabilidade',
          'Documentar processos atuais'
        ],
        Prata: [
          'Expandir programas de ESG',
          'Aumentar transparência em relatórios',
          'Fortalecer governança corporativa'
        ],
        Ouro: [
          'Manter liderança em sustentabilidade',
          'Inovar em práticas ESG',
          'Ampliar comunicação sobre impacto'
        ]
      }
    };

    res.json({
      success: true,
      data: {
        recomendacoesGerais: recomendacoes.geral,
        recomendacoesPorSelo: recomendacoes.porSelo[seal] || [],
        sealAtual: seal
      }
    });
  } catch (error) {
    console.error('Erro ao buscar recomendações:', error);
    res.status(500).json({ error: 'Erro ao buscar recomendações' });
  }
});

module.exports = router;
