import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')
    const protectedRoutes = ['/profile']
    console.log('middleware, token', token)
    
    if (protectedRoutes.some(path => 
      request.nextUrl.pathname.startsWith(path)) && !token
    ) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    return NextResponse.next()
  }
  
  export const config = {
    matcher: [
        '/((?!_next/static|favicon.ico).*)', // exclude static resources
        '/api/:path*'                        // all api routes  are allowed
      ]
  }