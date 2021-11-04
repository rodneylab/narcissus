import cookie from 'cookie';
import type { GetSession, Handle } from '@sveltejs/kit';
const COOKIE_NAME = process.env['USER_COOKIE_NAME'];

export async function getSession(
  ...[request]: Parameters<GetSession>
): Promise<ReturnType<GetSession>> {
  return { user: request.locals.user };
}

export async function handle(...[input]: Parameters<Handle>): Promise<ReturnType<Handle>> {
  const { request, resolve } = input;
  const cookies = cookie.parse(request.headers.cookie || '');
  const logout = request.path === '/api/logout';

  // before endpoint call
  request.locals.user = logout ? '' : cookies[COOKIE_NAME];

  // endpoint call
  const response = await resolve(request);

  // after endpoint call
  const { user } = request.locals.user;

  const secure = process.env.NODE_ENV === 'production';
  const maxAge = 7_200_000; // 1000 ms * 3600 s * 2 h
  const sameSite = 'Lax';

  response.headers['set-cookie'] = `${COOKIE_NAME}=${
    user ?? ''
  }; Max-Age=${maxAge}; Path=/; Secure=${secure}; HttpOnly; SameSite=${sameSite}`;

  return response;
}
