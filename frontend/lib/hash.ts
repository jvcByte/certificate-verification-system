import { keccak256 } from 'viem';

export async function hashFile(file: File): Promise<`0x${string}`> {
  const buffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(buffer);
  return keccak256(uint8Array);
}

export function hashString(input: string): `0x${string}` {
  return keccak256(new TextEncoder().encode(input));
}
