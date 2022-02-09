import type { RequestEvent } from '@sveltejs/kit';

export async function post({
  request,
}: RequestEvent): Promise<{ body?: string; status: number } | { body: string; status: number }> {
  try {
    const { providerToken, refreshToken } = await request.json();

    const response = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: { Authorization: `token ${providerToken}` },
    });
    const { login } = await response.json();
    request.locals.user = login;
    // request.locals.accessToken = accessToken;
    request.locals.refreshToken = refreshToken;

    return {
      status: 200,
    };
  } catch (error) {
    const errorMessage = `Error in /query/tube-station.json.ts: ${error}`;
    console.error(errorMessage);
    return {
      status: 500,
      body: errorMessage,
    };
  }
}
