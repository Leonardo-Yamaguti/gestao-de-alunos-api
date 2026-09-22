import { readFileSync } from 'node:fs';

import { expect } from 'chai';
import request from 'supertest';

import app from '../src/app.js';
import { loginComoAdmin } from './helpers/login-admin.helper.js';
import { loginComoAluno } from './helpers/login-aluno.helper.js';

const dados = JSON.parse(
  readFileSync(new URL('./data/fluxos-alunos.json', import.meta.url), 'utf8')
);

describe('Fluxo de entrega de trabalho (Data-Driven Testing)', () => {
  for (const cenario of dados.cenarios) {
    it(cenario.descricao, async () => {
      const credenciaisAdmin = {
        email: process.env.ADMIN_EMAIL || dados.administrador.email,
        senha: process.env.ADMIN_SENHA || dados.administrador.senha,
      };
      const tokenAdmin = await loginComoAdmin(app, credenciaisAdmin);

      const cadastro = await request(app)
        .post('/api/admin/alunos')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send(cenario.aluno);

      expect(cadastro.status).to.equal(201);
      expect(cadastro.headers['content-type']).to.include('application/json');
      expect(cadastro.body).to.include({
        nome: cenario.aluno.nome,
        email: cenario.aluno.email,
        matricula: cenario.aluno.matricula,
        role: 'aluno',
      });
      expect(cadastro.body).to.have.property('id').that.is.a('string').and.is.not.empty;
      expect(cadastro.body).not.to.have.property('senha');

      const alunoId = cadastro.body.id;

      const matricula = await request(app)
        .post(`/api/admin/disciplinas/${cenario.disciplinaId}/matriculas`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({ alunoId });

      expect(matricula.status).to.equal(201);
      expect(matricula.body).to.include({
        alunoId,
        disciplinaId: cenario.disciplinaId,
      });

      const tokenAluno = await loginComoAluno(app, {
        email: cenario.aluno.email,
        senha: cenario.aluno.senha,
      });

      const entrega = await request(app)
        .post(`/api/alunos/${alunoId}/trabalhos`)
        .set('Authorization', `Bearer ${tokenAluno}`)
        .send({
          disciplinaId: cenario.disciplinaId,
          ...cenario.trabalho,
        });

      expect(entrega.status).to.equal(201);
      expect(entrega.headers['content-type']).to.include('application/json');
      expect(entrega.body).to.include({
        alunoId,
        disciplinaId: cenario.disciplinaId,
        titulo: cenario.trabalho.titulo,
        descricao: cenario.trabalho.descricao,
        status: 'entregue',
      });
      expect(entrega.body).to.have.property('id').that.is.a('string').and.is.not.empty;
      expect(entrega.body).to.have.property('dataEntrega');
    });
  }
});
