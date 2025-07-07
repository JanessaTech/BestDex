import { SiweMessage } from 'siwe'
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('POST: verify')
  try {
    const { message, signature } = await request.json();
    console.log('verify message:', message)
    console.log('verify signature:', signature)
    const siweMessage = new SiweMessage(message);
    const success = await siweMessage.verify({signature});
    console.log('verify success:', success)
    if (!success.success) return NextResponse.json({ ok: false })
    return NextResponse.json({ ok: true })
  } catch(err) {
    return NextResponse.json({ ok: false })
  }
}