import logger from '@/common/Logger';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  logger.info('GET: logout')
  return NextResponse.json({ ok: true })
  
}