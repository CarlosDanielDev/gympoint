import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization; // aqui eu capturo o token dos headers
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not Provided' });
  }
  const [, token] = authHeader.split(' '); // separei o token do Bearer
  try {
    const { secret } = authConfig;
    // console.log(secret);
    const decoded = await promisify(jwt.verify)(token, secret);
    // console.log(decoded);
    req.userId = decoded.id; // recupera id do usuário que fez a autenticação.
    req.gym_id = decoded.gym_id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid Token!' });
  }
};
