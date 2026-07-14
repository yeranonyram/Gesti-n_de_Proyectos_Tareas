import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'mi_super_secreto_2026',
  expiresIn: '7d',
}));
