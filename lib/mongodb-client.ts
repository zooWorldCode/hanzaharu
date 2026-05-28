import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
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

export function getMongoClient(): MongoClient {
  if (process.env.NODE_ENV === "development" && global._mongoClient) {
    return global._mongoClient;
  }

  const client = new MongoClient(getMongoUri());

  if (process.env.NODE_ENV === "development") {
    global._mongoClient = client;
  }

  return client;
}

export default getMongoClient;
