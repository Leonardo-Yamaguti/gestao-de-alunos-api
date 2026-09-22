import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gestao-de-alunos';

mongoose.connection.on('error', (err) => {
  console.error('Erro de conexão com o MongoDB:', err.message);
});

await mongoose.connect(MONGODB_URI);

if (process.env.NODE_ENV !== 'test') {
  console.log('MongoDB conectado com sucesso.');
}

export default mongoose;
