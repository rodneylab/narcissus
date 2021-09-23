import path from 'path';
import { getPost, getPostsContent } from '$lib/utilities/blog';

export async function get({ params }) {
  try {
    const { slug } = params;
    const __dirname = path.resolve();
    const location = path.join(__dirname, './src/routes/');
    const articles = await getPostsContent(location);
    const article = articles.find((element) => element.slug === slug);
    const postPromise = getPost(article.content, true);

    const response = await fetch(`${process.env['VITE_WORKER_URL']}/post/data`, {
      method: 'POST',
      credentials: 'none',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug,
      }),
    });
    const dataPromise = response.json();
    const [post, data] = await Promise.all([postPromise, dataPromise]);
    const { likes, views } = data;

    if (post) {
      return {
        body: JSON.stringify({ post: { ...post, slug, likes, views } }),
      };
    }
  } catch (error) {
    console.error(`Error: ${error}. Check slug "${params.slug}" is included in narcissus database`);
    return {
      status: 500,
      error: 'Error retreiving data',
    };
  }
}
