import Aluno from '../../src/models/aluno.model.js';
import Matricula from '../../src/models/matricula.model.js';
import Trabalho from '../../src/models/trabalho.model.js';

export async function limparDadosDosCenarios(cenarios) {
  const emails = cenarios.map(({ aluno }) => aluno.email);
  const matriculas = cenarios.map(({ aluno }) => aluno.matricula);

  const alunos = await Aluno.find({
    $or: [
      { email: { $in: emails } },
      { matricula: { $in: matriculas } },
    ],
  }).select('_id');

  const alunoIds = alunos.map(({ _id }) => _id);
  if (alunoIds.length === 0) return;

  await Promise.all([
    Trabalho.deleteMany({ alunoId: { $in: alunoIds } }),
    Matricula.deleteMany({ alunoId: { $in: alunoIds } }),
  ]);
  await Aluno.deleteMany({ _id: { $in: alunoIds } });
}

export default limparDadosDosCenarios;
