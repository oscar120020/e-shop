import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const session: any = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if(!session){
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('p', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  if(request.nextUrl.pathname.startsWith('/admin')){
    if(session.user.role !== 'admin'){
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/checkout/:path*', '/admin/:path*'],
}
