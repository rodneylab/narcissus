import dayjs from 'dayjs';
import type { JSX } from 'react';
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
import { useEffect, useRef } from 'react';

interface BlogPostSummaryProps {
  postTitle: string;
  datePublished: string;
  seoMetaDescription: string;
  slug: string;
  likes: number;
  views: number;
  comments: number;
}

const BlogPostSummary = function BlogPostSummary({
  postTitle,
  datePublished,
  seoMetaDescription,
  slug,
  likes,
  views,
  comments,
}: BlogPostSummaryProps): JSX.Element {
  const containerNode = useRef();

  useEffect(() => {
    const { current } = containerNode ?? {};

    if (current) {
      current.style.cursor = 'pointer';
    }

    const listener = () => {
      window.location.replace(`/${slug}/`);
    };
    current.addEventListener('mousedown', listener);

    return () => {
      if (current) {
        current.removeEventListener('mousedown', listener);
      }
    };
  }, [containerNode, slug]);

  const date = dayjs(datePublished);
  const dateString = `${date.format('D')} ${date.format('MMM')}`;
  const idString = `blog-post-summary-${slug}`;

  return (
    <div className={container} ref={containerNode}>
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
