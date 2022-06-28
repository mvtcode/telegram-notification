import mongoose from 'mongoose';
import { createLog } from './logger';

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
}

export default function connect() {
  const logger = createLog('core-apps/mongodb');
  const db = mongoose.connection;

  db.on('connecting', () => {
    logger.info('connecting to MongoDB...');
  });

  db.on('error', (error: any) => {
    logger.error(`Error in MongoDb connection: ${error}`);
    mongoose.disconnect();
  });
  db.on('connected', () => {
    logger.info('MongoDB connected!');
  });
  db.once('open', () => {
    logger.info('MongoDB connection opened!');
  });
  db.on('reconnected', () => {
    logger.info('MongoDB reconnected!');
  });
  db.on('disconnected', async () => {
    logger.info('MongoDB disconnected!');
    await wait(2000);
    mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });
  });

  mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  });
}
