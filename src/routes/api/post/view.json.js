export const post = async (request) => {
  try {
    const { slug } = request.body;
    const response = await fetch(`${process.env['VITE_WORKER_URL']}/post/view`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug,
      }),
    });
    const { views } = await response.json();
    return {
      status: 400,
      body: JSON.stringify({ views }),
    };
  } catch (err) {
    console.error('Error: ', err);
    return {
      status: 500,
      error: 'Error retreiving data',
    };
  }
};
