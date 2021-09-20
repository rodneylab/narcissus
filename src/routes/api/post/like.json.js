export const post = async (request) => {
  try {
    const { key, slug, token, unlike } = request.body;
    const response = await fetch(`${process.env['VITE_WORKER_URL']}/post/like`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key,
        slug,
        token,
        unlike,
      }),
    });
    const { likes } = await response.json();
    return {
      status: 400,
      body: JSON.stringify({ likes }),
    };
  } catch (err) {
    console.error('Error: ', err);
    return {
      status: 500,
      error: 'Error retreiving data',
    };
  }
};
