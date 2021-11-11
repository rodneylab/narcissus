import cookie from 'cookie';
import type { GetSession, Handle } from '@sveltejs/kit';
const COOKIE_NAME = process.env['USER_COOKIE_NAME'];

export async function getSession(
  ...[request]: Parameters<GetSession>
): Promise<ReturnType<GetSession>> {
  const user = request?.locals?.user;
  if (user) {
    return { user };
  }

  return {};
}

export async function handle(...[input]: Parameters<Handle>): Promise<ReturnType<Handle>> {
  const { request, resolve } = input;

  const loggingOut = request.path === '/api/logout';
  const cookies = cookie.parse(request.headers.cookie || '');

  // before endpoint call
  try {
    const receivedCookieValue = cookies[COOKIE_NAME] ? JSON.parse(cookies[COOKIE_NAME]) : '';
    if (receivedCookieValue) {
      request.locals.user = receivedCookieValue.user;
      request.locals.refreshToken = receivedCookieValue.refreshToken;
      request.locals.accessToken = receivedCookieValue.accessToken;
    }
  } catch (error) {
    // set no user if the JSON in the cookie is not valid
    request.locals.user = '';
  }

  // endpoint call
  const response = await resolve(request);

  // after endpoint call
  const user = loggingOut ? '' : request.locals.user;
  // const user = 'Hi';
  const cookieObject = loggingOut
    ? {}
    : {
        user,
        refreshToken: request.locals.refreshToken,
        accessToken: request.locals.accessToken,
      };

  const secure = process.env.NODE_ENV === 'production';
  const maxAge = 7_200; // 3600 s * 2 h
  const sameSite = 'Strict';

  const cookieValue = user ? JSON.stringify(cookieObject) : '';
  const cookieHeader = `${COOKIE_NAME}=${cookieValue}; Max-Age=${maxAge}; Path=/;${
    secure ? ' Secure;' : ''
  } HttpOnly; SameSite=${sameSite}`;

  return {
    ...response,
    headers: {
      ...response.headers,
      ...(user || loggingOut ? { 'Set-Cookie': cookieHeader } : {}),
    },
  };
}
