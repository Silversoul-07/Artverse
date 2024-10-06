import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const cookie = request.headers.get('cookie');
  let token = null;


  if (cookie) {
    const cookies = cookie.split(';');
    console.log(cookies);
    for (let i = 0; i < cookies.length; i++) {
      const [name, value] = cookies[i].trim().split('=');
      if (name === 'token') {
        token = value;
        break;
      }
    }
  }

  if (token) {
    console.log(token);
    const modifiedHeaders = new Headers(request.headers);
    modifiedHeaders.set('Authorization', `Bearer ${token}`);
    return NextResponse.next({
      request: {
        headers: modifiedHeaders,
      },
    });
  }
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/');

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/login', '/auth/signup'],
};