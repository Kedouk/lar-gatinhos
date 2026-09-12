import { pool } from './database.js';

async function seed() {
  try {
    await pool.query(`
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
      ) values
      (
        'Nome do gatinho',
        'Filhote',
        'Fêmea',
        'Breve descrição do gatinho.',
        'Carinhosa e brincalhona.',
        'gato-hero.png',
        false,
        true,
        true
      ),
      (
        'Nome do gatinho',
        'Adulto',
        'Macho',
        'Breve descrição do gatinho.',
        'Tranquilo e carinhoso.',
        'gato-hero.png',
        true,
        true,
        true
      ),
      (
        'Nome do gatinho',
        'Filhote',
        'Macho',
        'Breve descrição do gatinho.',
        'Brincalhão e curioso.',
        'gato-hero.png',
        false,
        true,
        true
      );
    `);

    console.log('3 gatinhos cadastrados com sucesso.');
  } catch (error) {
    console.error('Erro ao inserir gatinhos:', error);
  } finally {
    await pool.end();
  }
}

seed();