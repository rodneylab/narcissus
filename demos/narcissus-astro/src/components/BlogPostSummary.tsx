import dayjs from 'dayjs';
import React from 'react';
import type { FC } from 'react';
import { H_ELLIPSIS_ENTITY } from '$constants/entities';
import {
  container,
  content,
  contentBody,
  contentHeading,
  contentHeadingContainer,
  dateText,
  postMeta,
  viewsLikesContainer,
  viewsLikesContent,
} from '$components/BlogPostSummary.css';
import PostViewsLikes from '$components/PostViewsLikes';

interface BlogPostSummaryProps {
  postTitle: string;
  datePublished: string;
  seoMetaDescription: string;
  slug: string;
  likes: number;
  views: number;
  comments: number;
}

const BlogPostSummary: FC<BlogPostSummaryProps> = function BlogPostSummary({
  postTitle,
  datePublished,
  seoMetaDescription,
  slug,
  likes,
  views,
  comments,
}) {
  const handleMouseEnter = (event: MouseEvent) => {
    (event.target as HTMLElement).style.cursor = 'pointer';
  };

  const handleMouseLeave = (event: MouseEvent) => {
    (event.target as HTMLElement).style.cursor = 'default';
  };

  const handleMouseDown = async () => {
    // await prefetch(`/${slug}`);
    // goto(`/${slug}`);
  };

  const date = dayjs(datePublished);
  const dateString = `${date.format('D')} ${date.format('MMM')}`;
  const idString = `blog-post-summary-${slug}`;

  return (
    <div
      className={container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
    >
      <div className={content}>
        <h3 className={contentHeadingContainer}>
          <a
            aria-label={`Open ${postTitle} blog post`}
            aria-describedby={idString}
            className={contentHeading}
            href={`/${slug}/`}
          >
            {postTitle}
          </a>
        </h3>
        <section className={contentBody}>
          <div className={postMeta}>
            <div className={dateText}>{dateString}</div>
            <PostViewsLikes
              containerClass={viewsLikesContainer}
              contentClass={viewsLikesContent}
              likes={likes}
              views={views}
              comments={comments}
              slug={slug}
              interactive={false}
            />
          </div>
          <p>{seoMetaDescription}</p>
          <span id={idString} aria-hidden="true">
            Read more {H_ELLIPSIS_ENTITY}
          </span>
        </section>
      </div>
    </div>
  );
};

export default BlogPostSummary;
