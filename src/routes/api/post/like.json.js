export const post = async (request) => {
  try {
    const { slug, unlike } = request.body;
    await fetch(`${process.env['WORKER_URL']}/post/like`, {
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
    return {
      status: 400,
      body: 'Like added.',
    };
  } catch (err) {
    console.error('Error: ', err);
    return {
      status: 500,
      error: 'Error retreiving data',
    };
  }
};
