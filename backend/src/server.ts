import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from './database/database.js';
import { autenticar } from './middleware/auth.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

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

app.post('/login', async (req, res) => {

  try {

    const {
      email,
      senha
    } = req.body;

    if (!email?.trim() || !senha) {

      return res.status(400).json({
        message: 'E-mail e senha são obrigatórios.'
      });

    }

    if (!JWT_SECRET) {

      console.error('JWT_SECRET não configurado.');

      return res.status(500).json({
        message: 'Configuração de autenticação não encontrada.'
      });

    }

    const resultado = await pool.query(`

      select
        id,
        nome,
        email,
        senha_hash
      from administradores
      where email = $1

    `, [email.trim().toLowerCase()]);

    if (resultado.rows.length === 0) {

      return res.status(401).json({
        message: 'E-mail ou senha incorretos.'
      });

    }

    const administrador = resultado.rows[0];

    const senhaValida = await bcrypt.compare(
      senha,
      administrador.senha_hash
    );

    if (!senhaValida) {

      return res.status(401).json({
        message: 'E-mail ou senha incorretos.'
      });

    }

    const token = jwt.sign(
      {
        id: administrador.id,
        email: administrador.email,
        nome: administrador.nome
      },
      JWT_SECRET,
      {
        expiresIn: '8h'
      }
    );

    res.json({
      token,
      administrador: {
        id: administrador.id,
        nome: administrador.nome,
        email: administrador.email
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Erro ao realizar o login.'
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

app.post('/gatos', autenticar, async (req, res) => {

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

app.put('/gatos/:id', autenticar, async (req, res) => {

  try {

    const id = Number(req.params.id);

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

    if (!Number.isInteger(id)) {

      return res.status(400).json({
        message: 'ID do gatinho inválido.'
      });

    }

    if (!nome || !idade || !sexo || !foto) {

      return res.status(400).json({
        message: 'Nome, idade, sexo e foto são obrigatórios.'
      });

    }

    const resultado = await pool.query(`

      update gatos
      set
        nome = $1,
        idade = $2,
        sexo = $3,
        descricao = $4,
        personalidade = $5,
        foto = $6,
        castrado = $7,
        vacinado = $8,
        disponivel = $9

      where id = $10

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
      disponivel ?? true,
      id
    ]);

    if (resultado.rows.length === 0) {

      return res.status(404).json({
        message: 'Gatinho não encontrado.'
      });

    }

    res.json(resultado.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Erro ao atualizar o gatinho.'
    });

  }

});

app.delete('/gatos/:id', autenticar, async (req, res) => {

  try {

    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {

      return res.status(400).json({
        message: 'ID do gatinho inválido.'
      });

    }

    const gato = await pool.query(`

      select id
      from gatos
      where id = $1

    `, [id]);

    if (gato.rows.length === 0) {

      return res.status(404).json({
        message: 'Gatinho não encontrado.'
      });

    }

    const solicitacoes = await pool.query(`

      select id
      from solicitacoes_adocao
      where gato_id = $1
      limit 1

    `, [id]);

    if (solicitacoes.rows.length > 0) {

      return res.status(409).json({
        message: 'Não é possível excluir este gatinho porque existem solicitações de adoção vinculadas a ele.'
      });

    }

    await pool.query(`

      delete from gatos
      where id = $1

    `, [id]);

    res.json({
      message: 'Gatinho excluído com sucesso.'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Erro ao excluir o gatinho.'
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
      mensagem,
      cidade,
      idade,
      tipo_moradia,
      tipo_imovel,
      casa_telada,
      moradia_segura,
      quantidade_moradores,
      todos_de_acordo,
      possui_outros_animais,
      compromisso_longo_prazo,
      respeita_tempo_adaptacao,
      motivo_adocao,
      sobre_adotante
    } = req.body;

    const gatoId =
      gato_id === null ||
      gato_id === undefined ||
      gato_id === ''
        ? null
        : Number(gato_id);

    const idadeNumerica = Number(idade);
    const quantidadeMoradoresNumerica =
      Number(quantidade_moradores);

    if (
      (gatoId !== null && !Number.isInteger(gatoId)) ||
      !nome?.trim() ||
      !email?.trim() ||
      !telefone?.trim() ||
      !cidade?.trim() ||
      !Number.isInteger(idadeNumerica) ||
      idadeNumerica < 18 ||
      !tipo_moradia?.trim() ||
      !tipo_imovel?.trim() ||
      typeof casa_telada !== 'boolean' ||
      typeof moradia_segura !== 'boolean' ||
      !Number.isInteger(quantidadeMoradoresNumerica) ||
      quantidadeMoradoresNumerica < 1 ||
      typeof todos_de_acordo !== 'boolean' ||
      typeof possui_outros_animais !== 'boolean' ||
      typeof compromisso_longo_prazo !== 'boolean' ||
      typeof respeita_tempo_adaptacao !== 'boolean'
    ) {

      return res.status(400).json({
        message: 'Preencha corretamente todos os campos obrigatórios.'
      });

    }

    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    if (!emailValido) {

      return res.status(400).json({
        message: 'Informe um e-mail válido.'
      });

    }

    if (gatoId !== null) {

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

    }

    const resultado = await pool.query(`

      insert into solicitacoes_adocao (
        gato_id,
        nome,
        email,
        telefone,
        mensagem,
        cidade,
        idade,
        tipo_moradia,
        tipo_imovel,
        casa_telada,
        moradia_segura,
        quantidade_moradores,
        todos_de_acordo,
        possui_outros_animais,
        compromisso_longo_prazo,
        respeita_tempo_adaptacao,
        motivo_adocao,
        sobre_adotante
      )

      values (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15,
        $16, $17, $18
      )

      returning
        id,
        gato_id,
        nome,
        email,
        telefone,
        mensagem,
        cidade,
        idade,
        tipo_moradia,
        tipo_imovel,
        casa_telada,
        moradia_segura,
        quantidade_moradores,
        todos_de_acordo,
        possui_outros_animais,
        compromisso_longo_prazo,
        respeita_tempo_adaptacao,
        motivo_adocao,
        sobre_adotante,
        status,
        criada_em

    `, [
      gatoId,
      nome.trim(),
      email.trim(),
      telefone.trim(),
      mensagem?.trim() || '',
      cidade.trim(),
      idadeNumerica,
      tipo_moradia.trim(),
      tipo_imovel.trim(),
      casa_telada,
      moradia_segura,
      quantidadeMoradoresNumerica,
      todos_de_acordo,
      possui_outros_animais,
      compromisso_longo_prazo,
      respeita_tempo_adaptacao,
      motivo_adocao?.trim() || '',
      sobre_adotante?.trim() || ''
    ]);

    res.status(201).json(resultado.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Erro ao registrar a solicitação de adoção.'
    });

  }

});

app.get('/solicitacoes-adocao', autenticar, async (_req, res) => {

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
        solicitacoes_adocao.cidade,
        solicitacoes_adocao.idade,
        solicitacoes_adocao.tipo_moradia,
        solicitacoes_adocao.tipo_imovel,
        solicitacoes_adocao.casa_telada,
        solicitacoes_adocao.moradia_segura,
        solicitacoes_adocao.quantidade_moradores,
        solicitacoes_adocao.todos_de_acordo,
        solicitacoes_adocao.possui_outros_animais,
        solicitacoes_adocao.compromisso_longo_prazo,
        solicitacoes_adocao.respeita_tempo_adaptacao,
        solicitacoes_adocao.motivo_adocao,
        solicitacoes_adocao.sobre_adotante,
        solicitacoes_adocao.status,
        solicitacoes_adocao.criada_em

      from solicitacoes_adocao

      left join gatos
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

app.patch('/solicitacoes-adocao/:id/status', autenticar, async (req, res) => {

  try {

    const id = Number(req.params.id);

    const {
      status
    } = req.body;

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
        cidade,
        idade,
        tipo_moradia,
        tipo_imovel,
        casa_telada,
        moradia_segura,
        quantidade_moradores,
        todos_de_acordo,
        possui_outros_animais,
        compromisso_longo_prazo,
        respeita_tempo_adaptacao,
        motivo_adocao,
        sobre_adotante,
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

app.delete('/solicitacoes-adocao/:id', autenticar, async (req, res) => {

  try {

    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {

      return res.status(400).json({
        message: 'ID da solicitação inválido.'
      });

    }

    const resultado = await pool.query(`

      delete from solicitacoes_adocao

      where id = $1

      returning id

    `, [id]);

    if (resultado.rows.length === 0) {

      return res.status(404).json({
        message: 'Solicitação não encontrada.'
      });

    }

    res.json({
      message: 'Solicitação excluída com sucesso.'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Erro ao excluir a solicitação de adoção.'
    });

  }

});

app.listen(PORT, () => {

  console.log(`Servidor rodando em http://localhost:${PORT}`);

});