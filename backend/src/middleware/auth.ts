import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthRequest extends Request {
  administrador?: {
    id: number;
    email: string;
    nome: string;
  };
}

export function autenticar(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {

  if (!JWT_SECRET) {

    res.status(500).json({
      message: 'JWT_SECRET não configurado.'
    });

    return;
  }

  const autorizacao = req.headers.authorization;

  if (!autorizacao) {

    res.status(401).json({
      message: 'Token de autenticação não informado.'
    });

    return;
  }

  const partes = autorizacao.split(' ');

  if (
    partes.length !== 2 ||
    partes[0] !== 'Bearer'
  ) {

    res.status(401).json({
      message: 'Formato de token inválido.'
    });

    return;
  }

  const token = partes[1];

  try {

    const payload = jwt.verify(
      token,
      JWT_SECRET
    ) as {
      id: number;
      email: string;
      nome: string;
    };

    req.administrador = {
      id: payload.id,
      email: payload.email,
      nome: payload.nome
    };

    next();

  } catch (erro) {

    res.status(401).json({
      message: 'Token inválido ou expirado.'
    });

  }

}