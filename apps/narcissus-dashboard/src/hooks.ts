import type { GetSession, Handle, RequestEvent } from '@sveltejs/kit';
import cookie from 'cookie';
const COOKIE_NAME = process.env['USER_COOKIE_NAME'];

export async function getSession({
  locals,
  request,
}: RequestEvent & { locals: { user: string } }): Promise<ReturnType<GetSession>> {
  const user = locals?.user;
  if (user) {
    return { user };
  }

  return {};
}

export async function handle(...[input]: Parameters<Handle>): Promise<ReturnType<Handle>> {
  const { event, resolve } = input;
  const { locals, request, url } = event as RequestEvent & {
    locals: { user: string; refreshToken: string };
  };
  const { pathname } = url;
  const { headers } = request;
  const loggingOut = pathname === '/api/logout';
  const cookies = cookie.parse(headers.get('cookie') || '');

  // before endpoint call
  try {
    const receivedCookieValue = cookies[COOKIE_NAME] ? JSON.parse(cookies[COOKIE_NAME]) : '';
    if (receivedCookieValue) {
      locals.user = receivedCookieValue.user;
      locals.refreshToken = receivedCookieValue.refreshToken;
      // request.locals.accessToken = receivedCookieValue.accessToken;
    }
  } catch (error) {
    // set no user if the JSON in the cookie is not valid
    locals.user = '';
  }

  // endpoint call
  const response = await resolve(event);

  // after endpoint call
  const user = loggingOut ? '' : locals.user;
  const cookieObject = loggingOut
    ? {}
    : {
        user,
        refreshToken: locals.refreshToken,
        // accessToken: request.locals.accessToken,
      };

  const secure = process.env.NODE_ENV === 'production';
  const maxAge = 7_200; // 3600 s * 2 h
  const sameSite = 'Strict';

  const cookieValue = user ? JSON.stringify(cookieObject) : '';
  const cookieHeader = `${COOKIE_NAME}=${cookieValue}; Max-Age=${maxAge}; Path=/;${
    secure ? ' Secure;' : ''
  } HttpOnly; SameSite=${sameSite}`;

  if (user || loggingOut) {
    response.headers.set('Set-Cookie', cookieHeader);
  }
  return response;
}
