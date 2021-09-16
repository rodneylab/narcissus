export const post = async (request) => {
  try {
    const { slug } = request.body;
    const response = await fetch(`${process.env['WORKER_URL']}/post/data`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug,
      }),
    });
    const { count } = await response.json();
    return {
      body: JSON.stringify({ count }),
    };
  } catch (err) {
    console.log('Error: ', err);
    return {
      status: 500,
      error: 'Error retreiving data',
    };
  }
};
