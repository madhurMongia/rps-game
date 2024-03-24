'use server';
import { encodePacked, keccak256 } from 'viem';
import crypto from 'crypto';

const SECRET_KEY = process.env.SALT_HASH_KEY || 'default_not_random_key';
const ALGORITHM = 'aes-256-ecb';
const KEY_LENGTH = 32; 
function encrypt(originalValue:any) {
  const cipher = crypto.createCipher(ALGORITHM, SECRET_KEY.slice(0, KEY_LENGTH));
  let encrypted = cipher.update(String(originalValue), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export async function decrypt(hashedValue:any) {
  'use server';
  console.log(hashedValue)
  const decipher = crypto.createDecipher(ALGORITHM, SECRET_KEY.slice(0, KEY_LENGTH));
  let decrypted = decipher.update(String(hashedValue), 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function getRandomUInt256() {
    const randomBytes = crypto.randomBytes(32);
    return BigInt('0x' + randomBytes.toString('hex'));
  }

export async function hashMove(move:any) {
  'use server'
  console.log(move)
    const salt = getRandomUInt256()
    console.log(salt)
    const hashedMove = keccak256(
        encodePacked(["uint8", "uint256"], [move, salt]),
        );
    const hashedSalt = encrypt(salt);
  return { salt:String(hashedSalt),hashedMove }
}