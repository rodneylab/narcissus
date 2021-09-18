export const post = async (request) => {
  try {
    const { slug, unlike } = request.body;
    const response = await fetch(`${process.env['WORKER_URL']}/post/like`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug,
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
