import { randomUUID } from 'crypto';
import {
  BUCKET_FOTOS_GATOS,
  supabase
} from './supabase.js';

export async function salvarFotoGato(foto: string): Promise<string> {
  // Se já for uma URL, não precisamos fazer um novo upload.
  if (foto.startsWith('http://') || foto.startsWith('https://')) {
    return foto;
  }

  // Verifica se a imagem está no formato Base64 esperado.
  const correspondencia = foto.match(
    /^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/
  );

  if (!correspondencia) {
    throw new Error('Formato de imagem inválido.');
  }

  const extensaoOriginal = correspondencia[1];
  const extensao = extensaoOriginal === 'jpeg'
    ? 'jpg'
    : extensaoOriginal;

  const tiposPermitidos: Record<string, string> = {
    jpg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp'
  };

  const conteudo = Buffer.from(correspondencia[2], 'base64');

  if (conteudo.length === 0) {
    throw new Error('A imagem está vazia.');
  }

  const nomeArquivo = `${randomUUID()}.${extensao}`;

  const { error } = await supabase.storage
    .from(BUCKET_FOTOS_GATOS)
    .upload(nomeArquivo, conteudo, {
      contentType: tiposPermitidos[extensao],
      upsert: false
    });

  if (error) {
    console.error('Erro ao enviar foto ao Supabase:', error);
    throw new Error('Não foi possível enviar a imagem.');
  }

  const { data } = supabase.storage
    .from(BUCKET_FOTOS_GATOS)
    .getPublicUrl(nomeArquivo);

  return data.publicUrl;
}

export async function excluirFotoGato(url: string): Promise<void> {
  if (
    !url.startsWith('http://') &&
    !url.startsWith('https://')
  ) {
    return;
  }

  const prefixo = `/storage/v1/object/public/${BUCKET_FOTOS_GATOS}/`;

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
    console.error('Erro ao excluir foto do Supabase:', error);
    throw new Error('Não foi possível excluir a imagem.');
  }
}