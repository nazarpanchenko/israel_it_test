import mongoose, { ConnectOptions } from 'mongoose';

const { DB_HOST, DB_PORT, DB_NAME } = process.env;

const initDB = async (): Promise<void> => {
  mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
};

export default initDB;
