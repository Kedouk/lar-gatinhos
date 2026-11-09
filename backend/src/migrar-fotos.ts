
import { pool } from './database/database.js';
import {
  salvarFotoGato,
  excluirFotoGato
} from './services/fotos-gatos.js';

interface GatoPendente {
  id: number;
  nome: string;
  foto: string;
}

async function migrarFotos(): Promise<void> {
  try {
    console.log('Buscando fotos que ainda estão em Base64...');

    const resultado = await pool.query<GatoPendente>(`
      select
        id,
        nome,
        foto
      from gatos
      where foto like 'data:image/%;base64,%'
      order by id
    `);

    const gatos = resultado.rows;

    console.log(`Fotos pendentes de migração: ${gatos.length}`);

    if (gatos.length === 0) {
      console.log('Nenhuma foto precisa ser migrada.');
      return;
    }

    if (!process.argv.includes('--confirmar')) {
      console.log('');
      console.log('Nenhuma alteração foi realizada.');
      console.log('Para iniciar a migração, execute:');
      console.log('npx tsx src/migrar-fotos.ts --confirmar');
      return;
    }

    let migrados = 0;

    for (const gato of gatos) {
      console.log(`Migrando ${gato.nome} (ID ${gato.id})...`);

      const novaFoto = await salvarFotoGato(gato.foto);

      let atualizacao;

      try {
        atualizacao = await pool.query(
          `
            update gatos
            set foto = $1
            where id = $2
              and foto = $3
          `,
          [novaFoto, gato.id, gato.foto]
        );
      } catch (error) {
        console.error(
          'Não foi possível confirmar a atualização no banco. ' +
          'A nova imagem será preservada para evitar perda de uma foto já vinculada:',
          error
        );

        throw error;
      }

      if (atualizacao.rowCount !== 1) {
        try {
          await excluirFotoGato(novaFoto);
        } catch (erroExclusao) {
          console.error(
            'Não foi possível remover a imagem enviada:',
            erroExclusao
          );
        }

        throw new Error(
          `O registro ${gato.id} foi alterado durante a migração.`
        );
      }

      migrados++;

      console.log(`Foto migrada com sucesso: ${gato.nome}`);
    }

    console.log('');
    console.log('Migração concluída!');
    console.log(`Fotos migradas: ${migrados}`);
    console.log(`Total encontrado: ${gatos.length}`);

  } catch (error) {
    console.error('');
    console.error('Erro durante a migração:', error);
    process.exitCode = 1;

  } finally {
    await pool.end();
  }
}

migrarFotos();
