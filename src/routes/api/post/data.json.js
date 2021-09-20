export const post = async (request) => {
  try {
    const { slug } = request.body;
    const response = await fetch(`${process.env['VITE_WORKER_URL']}/post/data`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug,
      }),
    });
    const { likes, views } = await response.json();
    return {
      body: JSON.stringify({ likes, views }),
    };
  } catch (err) {
    console.log('Error: ', err);
    return {
      status: 500,
      error: 'Error retreiving data',
    };
  }
};
