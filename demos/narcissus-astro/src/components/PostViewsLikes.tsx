import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import PostViewsLikesPure from '$components/PostViewsLikesPure';
import website from '$configuration/website';

interface PostViewsLikesProps {
  likes: number;
  views: number;
  slug: string;
  comments: number;
  containerClass: string | undefined;
  contentClass: string | undefined;
  interactive: boolean;
}

const PostViewsLikes = function PostViewsLikes({
  likes: initialLikes,
  views: initialViews,
  slug,
  comments: initialComments,
  containerClass = undefined,
  contentClass = undefined,
  interactive = true,
}: PostViewsLikesProps): JSX.Element {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [comments, setComments] = useState<number>(initialComments);
  const [views, setViews] = useState<number>(initialViews);

  const { workerUrl } = website;

  useEffect(() => {
    async function getViewsLikes() {
      try {
        const url = `${workerUrl}/post/data`;
        const response = await fetch(url, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            slug,
          }),
        });
        const data = await response.json();
        const { comments: freshComments, likes: freshLikes, views: freshViews } = data;
        setComments(freshComments.length);
        setLikes(freshLikes);
        setViews(freshViews);
      } catch (error) {
        console.error(`Error in PostViewsLikes: ${error}`);
      }
    }

    getViewsLikes();
  }, [slug, workerUrl]);

  return (
    <PostViewsLikesPure
      containerClass={containerClass}
      contentClass={contentClass}
      slug={slug}
      likes={likes}
      views={views}
      comments={comments}
      interactive={interactive}
    />
  );
};

export default PostViewsLikes;
