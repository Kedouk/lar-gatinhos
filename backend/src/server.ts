import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './database/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (_req, res) => {
  res.json({
    message: 'API do Lar Gatinhos funcionando!'
  });
});

app.get('/teste-banco', async (_req, res) => {
  try {
    const resultado = await pool.query('select now()');

    res.json({
      message: 'Conexão com o banco funcionando!',
      horario: resultado.rows[0].now
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Erro ao conectar com o banco de dados.'
    });
  }
});

app.get('/gatos', async (_req, res) => {
  try {
    const resultado = await pool.query(`
      select
        id,
        nome,
        idade,
        sexo,
        descricao,
        personalidade,
        foto,
        castrado,
        vacinado,
        disponivel
      from gatos
      order by id
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Erro ao buscar os gatinhos.'
    });
  }
});

app.get('/gatos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: 'ID do gatinho inválido.'
      });
    }

    const resultado = await pool.query(`
      select
        id,
        nome,
        idade,
        sexo,
        descricao,
        personalidade,
        foto,
        castrado,
        vacinado,
        disponivel
      from gatos
      where id = $1
    `, [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        message: 'Gatinho não encontrado.'
      });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Erro ao buscar o gatinho.'
    });
  }
});

app.post('/gatos', async (req, res) => {
  try {
    const {
      nome,
      idade,
      sexo,
      descricao,
      personalidade,
      foto,
      castrado,
      vacinado,
      disponivel
    } = req.body;

    if (!nome || !idade || !sexo || !foto) {
      return res.status(400).json({
        message: 'Nome, idade, sexo e foto são obrigatórios.'
      });
    }

    const resultado = await pool.query(`
      insert into gatos (
        nome,
        idade,
        sexo,
        descricao,
        personalidade,
        foto,
        castrado,
        vacinado,
        disponivel
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      returning
        id,
        nome,
        idade,
        sexo,
        descricao,
        personalidade,
        foto,
        castrado,
        vacinado,
        disponivel
    `, [
      nome.trim(),
      idade,
      sexo,
      descricao?.trim() || '',
      personalidade?.trim() || '',
      foto,
      castrado ?? false,
      vacinado ?? false,
      disponivel ?? true
    ]);

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Erro ao cadastrar o gatinho.'
    });
  }
});

app.post('/solicitacoes-adocao', async (req, res) => {
  try {
    const {
      gato_id,
      nome,
      email,
      telefone,
      mensagem
    } = req.body;

    const gatoId = Number(gato_id);

    if (
      !Number.isInteger(gatoId) ||
      !nome?.trim() ||
      !email?.trim() ||
      !telefone?.trim()
    ) {
      return res.status(400).json({
        message: 'Gato, nome, e-mail e telefone são obrigatórios.'
      });
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    if (!emailValido) {
      return res.status(400).json({
        message: 'Informe um e-mail válido.'
      });
    }

    const gato = await pool.query(`
      select id
      from gatos
      where id = $1
        and disponivel = true
    `, [gatoId]);

    if (gato.rows.length === 0) {
      return res.status(404).json({
        message: 'Gatinho não encontrado ou não está disponível para adoção.'
      });
    }

    const resultado = await pool.query(`
      insert into solicitacoes_adocao (
        gato_id,
        nome,
        email,
        telefone,
        mensagem
      )
      values ($1, $2, $3, $4, $5)
      returning
        id,
        gato_id,
        nome,
        email,
        telefone,
        mensagem,
        status,
        criada_em
    `, [
      gatoId,
      nome.trim(),
      email.trim(),
      telefone.trim(),
      mensagem?.trim() || ''
    ]);

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Erro ao registrar a solicitação de adoção.'
    });
  }
});

app.get('/solicitacoes-adocao', async (_req, res) => {
  try {
    const resultado = await pool.query(`
      select
        solicitacoes_adocao.id,
        solicitacoes_adocao.gato_id,
        gatos.nome as gato_nome,
        solicitacoes_adocao.nome,
        solicitacoes_adocao.email,
        solicitacoes_adocao.telefone,
        solicitacoes_adocao.mensagem,
        solicitacoes_adocao.status,
        solicitacoes_adocao.criada_em
      from solicitacoes_adocao
      inner join gatos
        on gatos.id = solicitacoes_adocao.gato_id
      order by solicitacoes_adocao.criada_em desc
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Erro ao buscar as solicitações de adoção.'
    });
  }
});

app.patch('/solicitacoes-adocao/:id/status', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const statusPermitidos = [
      'Pendente',
      'Em análise',
      'Aprovada',
      'Recusada'
    ];

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: 'ID da solicitação inválido.'
      });
    }

    if (!statusPermitidos.includes(status)) {
      return res.status(400).json({
        message: 'Status inválido.'
      });
    }

    const resultado = await pool.query(`
      update solicitacoes_adocao
      set status = $1
      where id = $2
      returning
        id,
        gato_id,
        nome,
        email,
        telefone,
        mensagem,
        status,
        criada_em
    `, [status, id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        message: 'Solicitação não encontrada.'
      });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Erro ao atualizar o status da solicitação.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});