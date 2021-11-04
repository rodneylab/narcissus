import type { Request } from '@sveltejs/kit';
import type { ResponseHeaders } from '@sveltejs/kit/types/helper';

const COOKIE_NAME = process.env['API_COOKIE_NAME'];

export async function post(
  request: Request & {
    body: { accessToken: string; providerToken: string; refreshToken: string };
  },
): Promise<{
  status: number;
  headers: ResponseHeaders;
}> {
  const { accessToken, providerToken, refreshToken } = request.body;

  const response = await fetch('https://api.github.com/user', {
    method: 'GET',
    headers: { Authorization: `token ${providerToken}` },
  });
  const { login } = await response.json();
  console.log('user/api: ', login);
  request.locals.user = login;

  const secure = process.env.NODE_ENV === 'production';
  const maxAge = 7_200_000; // 1000 ms * 3600 s * 2 h
  const sameSite = 'Lax';

  const apiCookie = `${COOKIE_NAME}=${JSON.stringify({
    accessToken,
    providerToken,
    refreshToken,
  })}; Max-Age=${maxAge}; Path=/; Secure=${secure}; HttpOnly; SameSite=${sameSite}`;

  return {
    status: 302,
    headers: {
      location: '/dashboard',
      'Set-Cookie': apiCookie,
    },
  };
}
