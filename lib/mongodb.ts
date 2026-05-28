import mongooseLib, { type Mongoose } from "mongoose";

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.",
    );
  }
  return uri;
}

function getCache(): MongooseCache {
  if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
  }
  return global.mongoose;
}

export async function connectDB(): Promise<Mongoose> {
  const cached = getCache();

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongooseLib.connect(getMongoUri(), opts).then((instance) => {
      return instance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
