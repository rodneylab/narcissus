import path from 'path';

import { BLOG_PATH, getPosts, getPostsContent } from '$lib/utilities/blog';

export async function get() {
  const __dirname = path.resolve();
  const location = path.join(__dirname, BLOG_PATH);
  const postsContent = await getPostsContent(location);
  const posts = await getPosts(postsContent, false);
  return { body: JSON.stringify({ posts }) };
}
