import path from 'path';

import { BLOG_PATH, getPosts, getPostsContent } from '$lib/utilities/blog';

export async function get() {
  try {
    const __dirname = path.resolve();
    const location = path.join(__dirname, BLOG_PATH);
    const postsContent = await getPostsContent(location);
    const posts = await getPosts(postsContent, false);

    let postDataPromises = posts.map(async (element) => {
      const { slug } = element;
      const response = await fetch(`${process.env['VITE_WORKER_URL']}/post/data`, {
        method: 'POST',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
        }),
      });
      const data = await response.json();
      const { comments, likes, views } = data;
      return { ...element, comments, likes, views };
    });

    const postData = await Promise.all(postDataPromises);

    return { body: JSON.stringify({ posts: postData }) };
  } catch (error) {
    console.log(`Error in index.json get endpoint: ${error}`);
  }
}
