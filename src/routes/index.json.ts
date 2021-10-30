import path from 'path';

import { BLOG_PATH, getPosts, getPostsContent } from '$lib/utilities/blog';

async function getResponse(slug: string): Promise<Response> {
  try {
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
    console.log(`Error in fetch request for ${slug}: ${error}`);
  }
}

export async function get() {
  try {
    const __dirname = path.resolve();
    const location = path.join(__dirname, BLOG_PATH);
    const postsContent: { slug: string }[] = await getPostsContent(location);
    const posts = await getPosts(postsContent, false);

    let postDataPromises = posts.map(async (element) => {
      const response = await getResponse(element.slug);
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
