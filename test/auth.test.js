import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('POST /api/auth/login', () => {
  it('retorna 401 quando a senha do administrador é inválida', async () => {
    const resposta = await request(app)
      .post('/api/auth/login')
      .send({
        email: process.env.ADMIN_EMAIL || 'admin@escola.com',
        senha: 'senha-incorreta',
      });

    expect(resposta.status).to.equal(401);
    expect(resposta.headers['content-type']).to.include('application/json');
    expect(resposta.body.error).to.equal('E-mail ou senha inválidos.');
  });
});
