import request from 'supertest';
import { expect } from 'chai';

export async function loginComoAluno(app, credenciais, alunoIdEsperado) {
  const resposta = await request(app)
    .post('/api/auth/login')
    .send(credenciais);

  expect(resposta.status).to.equal(200);
  expect(resposta.headers['content-type']).to.include('application/json');
  expect(resposta.body)
    .to.have.property('token')
    .that.is.a('string')
    .and.matches(/^[^.]+\.[^.]+\.[^.]+$/);
  expect(resposta.body.usuario).to.include({
    email: credenciais.email,
    role: 'aluno',
  });
  expect(resposta.body.usuario).not.to.have.property('senha');

  if (alunoIdEsperado) {
    expect(resposta.body.usuario.id).to.equal(alunoIdEsperado);
  }

  return resposta.body.token;
}

export default loginComoAluno;
