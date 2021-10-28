import path from 'path';

import { BLOG_PATH, getPosts, getPostsContent } from '$lib/utilities/blog';

export async function get() {
  const __dirname = path.resolve();
  const location = path.join(__dirname, BLOG_PATH);
  const postsContent = await getPostsContent(location);
  const posts = await getPosts(postsContent, false);

  let postDataPromises = posts.map(async (element) => {
    const { slug } = element;

    const dataResponsePromise = fetch(`${process.env['VITE_WORKER_URL']}/post/data`, {
      method: 'POST',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug,
      }),
    });
    const dataResponse = await dataResponsePromise;
    const dataPromise = dataResponse.json();

    const data = await dataPromise;
    const { comments, likes, views } = data;
    return { ...element, comments, likes, views };
  });

  const postData = await Promise.all(postDataPromises);

  return { body: JSON.stringify({ posts: postData }) };
}
