import { encodePacked, keccak256 } from 'viem';
import crypto from 'crypto';

function getRandomUInt256() {
    const randomBytes = crypto.randomBytes(32);
    return BigInt('0x' + randomBytes.toString('hex'));
  }

export function hashMove(move:any) {
    const salt = getRandomUInt256()
    const hashedMove = keccak256(
        encodePacked(["uint8", "uint256"], [move, salt]),
        );
  return { salt:String(salt),hashedMove }
}