import type { Request } from '@sveltejs/kit';

export async function post(
  request: Request & {
    body: { accessToken: string; providerToken: string; refreshToken: string };
  },
): Promise<{
  status: number;
}> {
  const { accessToken, providerToken, refreshToken } = request.body;

  const response = await fetch('https://api.github.com/user', {
    method: 'GET',
    headers: { Authorization: `token ${providerToken}` },
  });
  const { login } = await response.json();
  request.locals.user = login;
  request.locals.accessToken = accessToken;
  request.locals.refreshToken = refreshToken;

  return {
    status: 200,
  };
}
