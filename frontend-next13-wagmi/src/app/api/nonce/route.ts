import { generateNonce } from 'siwe';
import { NextResponse } from 'next/server';

export async function  GET(request: Request) {
  console.log('handler nonce ...')
  const nonce = generateNonce();
  console.log('new Nonce: ', nonce)
  return new NextResponse(nonce, {
    headers: {'Content-Type': 'text/plain'}
  })
}