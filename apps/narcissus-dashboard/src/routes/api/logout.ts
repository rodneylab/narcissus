import type { Request } from '@sveltejs/kit';
import type { ResponseHeaders } from '@sveltejs/kit/types/helper';

export async function get(request: Request): Promise<{
  status: number;
  headers: ResponseHeaders;
}> {
  request.locals.user = null;

  return {
    status: 302,
    headers: {
      location: '/',
    },
  };
}
