import { generateNonce } from 'siwe';
import { NextResponse } from 'next/server';
import logger from '@/common/Logger';

export async function  GET(request: Request) {
  logger.debug('handler nonce ...')
  const nonce = generateNonce();
  logger.debug('new Nonce: ', nonce)
  return new NextResponse(nonce, {
    headers: {'Content-Type': 'text/plain'}
  })
}