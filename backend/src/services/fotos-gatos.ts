
import { randomUUID } from 'crypto';

import {
  BUCKET_FOTOS_GATOS,
  supabase
} from './supabase.js';

const TAMANHO_MAXIMO = 2 * 1024 * 1024;

export class ErroFotoGato extends Error {
  statusCode: number;

  constructor(mensagem: string, statusCode = 400) {
    super(mensagem);
    this.name = 'ErroFotoGato';
    this.statusCode = statusCode;
  }
}

export async function salvarFotoGato(
  foto: string
): Promise<string> {

  // Se já for uma URL, não precisamos fazer novo upload.
  if (
    foto.startsWith('http://') ||
    foto.startsWith('https://')
  ) {
    return foto;
  }

  // Aceita somente imagens WEBP em Base64.
  const correspondencia = foto.match(
    /^data:image\/webp;base64,([A-Za-z0-9+/]+={0,2})$/
  );

  if (!correspondencia) {
    throw new ErroFotoGato(
      'Formato de imagem inválido. Envie uma imagem WEBP.'
    );
  }

  const conteudo = Buffer.from(
    correspondencia[1],
    'base64'
  );

  if (conteudo.length === 0) {
    throw new ErroFotoGato('A imagem está vazia.');
  }

  if (conteudo.length > TAMANHO_MAXIMO) {
    throw new ErroFotoGato(
      'A imagem não pode ultrapassar 2 MB.'
    );
  }

  // Verifica a assinatura real do formato WEBP.
  const assinaturaValida =
    conteudo.length >= 12 &&
    conteudo.toString('ascii', 0, 4) === 'RIFF' &&
    conteudo.toString('ascii', 8, 12) === 'WEBP';

  if (!assinaturaValida) {
    throw new ErroFotoGato(
      'O conteúdo enviado não é uma imagem WEBP válida.'
    );
  }

  const nomeArquivo = `${randomUUID()}.webp`;

  const { error } = await supabase.storage
    .from(BUCKET_FOTOS_GATOS)
    .upload(nomeArquivo, conteudo, {
      contentType: 'image/webp',
      upsert: false
    });

  if (error) {
    console.error(
      'Erro ao enviar foto ao Supabase:',
      error
    );

    throw new ErroFotoGato(
      'Não foi possível enviar a imagem.',
      500
    );
  }

  const { data } = supabase.storage
    .from(BUCKET_FOTOS_GATOS)
    .getPublicUrl(nomeArquivo);

  return data.publicUrl;
}

export async function excluirFotoGato(
  url: string
): Promise<void> {

  if (
    !url.startsWith('http://') &&
    !url.startsWith('https://')
  ) {
    return;
  }

  const prefixo =
    `/storage/v1/object/public/${BUCKET_FOTOS_GATOS}/`;

  const indice = url.indexOf(prefixo);

  if (indice === -1) {
    return;
  }

  const caminhoArquivo = decodeURIComponent(
    url.substring(indice + prefixo.length)
  );

  if (!caminhoArquivo) {
    return;
  }

  const { error } = await supabase.storage
    .from(BUCKET_FOTOS_GATOS)
    .remove([caminhoArquivo]);

  if (error) {
    console.error(
      'Erro ao excluir foto do Supabase:',
      error
    );

    throw new Error(
      'Não foi possível excluir a imagem.'
    );
  }
}
