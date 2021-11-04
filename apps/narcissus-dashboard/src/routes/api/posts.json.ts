import type { Request } from '@sveltejs/kit';
import type { ResponseHeaders } from '@sveltejs/kit/types/helper';
import cookie from 'cookie';

const COOKIE_NAME = process.env['API_COOKIE_NAME'];

export async function get(
  request: Request,
): Promise<{ body: string; headers: ResponseHeaders } | { error: string; status: number }> {
  try {
    const cookies = cookie.parse(request.headers.cookie) ?? {};
    const { accessToken } = JSON.parse(cookies[COOKIE_NAME]);
    const authorisationToken = Buffer.from(`api:${accessToken}`, 'utf-8').toString('base64');

    const response = await fetch(`${process.env['WORKER_URL']}/posts`, {
      method: 'GET',
      credentials: 'omit',
      headers: {
        Authorization: `Basic ${authorisationToken}`,
      },
    });

    const data = await response.json();
    console.log('data: ', { data });

    return {
      body: JSON.stringify({ ...data }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (err) {
    const error = `Error in /api/posts.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error,
    };
  }
}
