import type { FC } from 'react';
import React from 'react';
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

const PostViewsLikes: FC<PostViewsLikesProps> = function PostViewsLikes({
  likes,
  views,
  slug,
  comments,
  containerClass = undefined,
  contentClass = undefined,
  interactive = true,
}) {
  const { workerUrl } = website;

  async function getViewsLikes(): Promise<{ likes: number; views: number }> {
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
      return response.json();
    } catch (error) {
      console.error(`Error in getViewsLikes: ${error}`);
      return null;
    }
  }

  const likesPromise = getViewsLikes() ?? { likes, views };

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
