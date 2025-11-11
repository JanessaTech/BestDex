import { SiweMessage } from 'siwe'
import { NextResponse } from 'next/server';
import logger from '@/common/Logger';

export async function POST(request: Request) {
  logger.debug('POST: verify')
  try {
    const { message, signature } = await request.json();
    logger.info('verify message:', message)
    logger.info('verify signature:', signature)
    const siweMessage = new SiweMessage(message);
    const success = await siweMessage.verify({signature});
    logger.info('verify success:', success)
    if (!success.success) return NextResponse.json({ ok: false })
    return NextResponse.json({ ok: true })
  } catch(err) {
    return NextResponse.json({ ok: false })
  }
}