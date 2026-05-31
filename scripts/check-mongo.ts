/**
 * MongoDB 연결 진단 (비밀번호는 출력하지 않음)
 * 실행: npx tsx scripts/check-mongo.ts
 */
import { config } from 'dotenv';
import { resolve } from 'path';
import { MongoClient } from 'mongodb';

config({ path: resolve(process.cwd(), '.env.local') });

const uri = process.env.MONGODB_URI?.trim();

function getMongoUri(): string {
  if (!uri) {
    throw new Error('MONGODB_URI is not defined');
  }
  return uri;
}

const mongoUri = getMongoUri();

const match = mongoUri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)/);
if (!match) {
  console.error('URI 형식 오류: mongodb+srv://USER:PASS@HOST/... 형태인지 확인');
  process.exit(1);
}

const [, user, pass, host] = match;
console.log('--- URI 파싱 ---');
console.log('scheme: mongodb+srv');
console.log('user:', user);
console.log('password 길이:', pass.length, '자');
console.log('host:', host);
console.log('placeholder 남음?:', pass === '<password>' || user.includes('<'));

if (pass === '<password>') {
  console.error('\n❌ 비밀번호가 아직 <password> 입니다. Atlas에서 설정한 실제 비밀번호로 바꿔야 합니다.');
  process.exit(1);
}

async function tryConnect(label: string, testUri: string) {
  const client = new MongoClient(testUri, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log(`\n✅ ${label}: 연결 성공`);
    return true;
  } catch (err) {
    const e = err as { message?: string; code?: number; codeName?: string };
    console.log(`\n❌ ${label}: ${e.message ?? err}`);
    if (e.code) console.log('   code:', e.code, e.codeName);
    return false;
  } finally {
    await client.close().catch(() => {});
  }
}

async function main() {
  console.log('\n--- 연결 시도 ---');
  const ok1 = await tryConnect('.env.local URI 그대로', mongoUri);

  if (!ok1 && !mongoUri.includes('authSource=')) {
    const withAuth = mongoUri.includes('?')
      ? `${mongoUri}&authSource=admin`
      : `${mongoUri}?authSource=admin`;
    await tryConnect('authSource=admin 추가', withAuth);
  }
}

main().catch(console.error);
