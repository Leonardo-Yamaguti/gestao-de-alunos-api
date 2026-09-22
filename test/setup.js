import 'dotenv/config';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'segredo-exclusivo-dos-testes';

let mongoEmMemoria;

if (!process.env.MONGODB_URI) {
  mongoEmMemoria = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoEmMemoria.getUri('gestao-de-alunos-test');
}

after(async () => {
  await mongoose.connection.close();
  if (mongoEmMemoria) {
    await mongoEmMemoria.stop();
  }
});
