import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('GET: logout')
  return NextResponse.json({ ok: true })
  
}