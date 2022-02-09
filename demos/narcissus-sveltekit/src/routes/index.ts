import path from 'path';

import { BLOG_PATH, getPosts, getPostsContent } from '$lib/utilities/blog';

async function getResponse(slug: string): Promise<Response> {
  try {
    // eslint-disable-next-line dot-notation
    return fetch(`${process.env['VITE_WORKER_URL']}/post/data`, {
      method: 'POST',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug,
      }),
    });
  } catch (error) {
    const errorMessage = `Error in fetch request for ${slug}: ${error}`;
    console.error(errorMessage);
  }
}

export async function get() {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const __dirname = path.resolve();
    const location = path.join(__dirname, BLOG_PATH);
    const postsContent: { slug: string }[] = await getPostsContent(location);
    const posts = await getPosts(postsContent, false);

    const postDataPromises = posts.map(async (element) => {
      const response = await getResponse(element.slug);
      const data = await response.json();
      const { comments, likes, views } = data;
      return {
        ...element,
        comments,
        likes,
        views,
      };
    });
    const postData = await Promise.all(postDataPromises);

    return { body: { ...{ posts: postData } } };
  } catch (error) {
    const errorMessage = `Error in index.json get endpoint: ${error}`;
    console.error(errorMessage);
    return {
      body: { error: errorMessage },
    };
  }
}

export default get;
