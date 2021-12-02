import type { FC } from 'react';
import React, { useState } from 'react';
import { postSummary } from '$components/BlogRoll.css';
import { H_ELLIPSIS_ENTITY } from '$constants/entities';
import BlogPostSummary from '$components/BlogPostSummary';

interface BlogRollProps {
  initialPosts?: number;
  posts: {
    datePublished: string;
    postTitle: string;
    seoMetaDescription: string;
    slug: string;
    likes: number;
    views: number;
    comments: { created_at: string; author: string; text: string }[];
  }[];
}

const BlogRoll: FC<BlogRollProps> = function BlogRoll({ initialPosts, posts }) {
  const [showPosts, setShowPosts] = useState(initialPosts);
  const displayPosts = useState(posts.slice(0, showPosts));

  const handleClick = () => {
    setShowPosts(showPosts + initialPosts);
  };

  const postCount = posts.length;
  return (
    <section role="feed">
      <h2>BLOG POSTS</h2>
      {posts.length > 0 ? (
        posts.map((element, index) => {
          const { comments, datePublished, likes, postTitle, seoMetaDescription, slug, views } =
            element;
          return (
            <article
              className={postSummary}
              aria-posinset={index + 1}
              aria-setsize={postCount}
              key={element.slug}
            >
              <BlogPostSummary
                datePublished={datePublished}
                postTitle={postTitle}
                seoMetaDescription={seoMetaDescription}
                slug={slug}
                likes={likes}
                views={views}
                comments={comments}
              />
            </article>
          );
        })
      ) : (
        <p>No posts yet</p>
      )}
      {showPosts < postCount ? (
        <button type="submit" onClick={handleClick}>
          See more {H_ELLIPSIS_ENTITY}
        </button>
      ) : null}
    </section>
  );
};

BlogRoll.defaultProps = {
  initialPosts: 4,
};

export default BlogRoll;
