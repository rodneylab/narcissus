import type { FC } from 'react';
import React, { useLayoutEffect, useState } from 'react';
import website from '../configuration/website';
import { container, content, icon, likeButton, link, meta } from './PostViewsLikesPure.css';
import NotYetLikedIcon from './Icons/HeartOutline';
import LikedIcon from './Icons/HeartSolid';
import ViewsIcon from './Icons/View';
import CommentIcon from './Icons/Comment';

interface PostViewsLikesPureProps {
  likes: number;
  views: number;
  slug: string;
  comments: number;
  containerClass: string;
  contentClass: string;
  interactive: boolean;
}

const PostViewsLikesPure: FC<PostViewsLikesPureProps> = function PostViewsLikesPure({
  likes,
  views,
  slug,
  comments,
  containerClass = undefined,
  contentClass = undefined,
  interactive = true,
}) {
  const [freshLikeCount, setFreshLikeCount] = useState(null);
  const [freshViewCount, setFreshViewCount] = useState(null);
  const [freshCommentCount, setFreshCommentCount] = useState(null);
  const [likeButtonHover, setLikeButtonHover] = useState(false);

  const ssr = import.meta.env.SSR;

  const liked = false;
  // const liked =
  //   JSON.parse($postLikedViewed).liked.find((element: { slug: string }) => element.slug === slug) !=
  //   null;
  const viewed = true;
  // const viewed = JSON.parse($postLikedViewed).viewed.includes(slug);

  function addViewToStore() {
    // const { liked: likedArray, viewed: viewedArray } = JSON.parse($postLikedViewed);
    // postLikedViewed.set(JSON.stringify({ liked: likedArray, viewed: [slug, ...viewedArray] }));
  }

  const { workerUrl } = website;

  async function handleView() {
    try {
      if (!viewed) {
        const responsePromise = fetch(`${workerUrl}/post/view`, {
          method: 'POST',
          credentials: 'omit',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            slug,
          }),
        });
        addViewToStore();
        const response = await responsePromise;
        const { views: incomingViews } = await response.json();
        setFreshViewCount(incomingViews);
      }
    } catch (error) {
      console.error(`Error in handleView: ${error}`);
    }
  }

  useLayoutEffect(() => {
    if (!ssr && interactive) {
      const handleIntersect = (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver,
      ) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            handleView();
          }
        });
      };
      const options = { threshold: 1, rootMargin: '100% 0% -100%' };
      const observer = new IntersectionObserver(handleIntersect, options);
      const element = window.document.querySelector('main').firstElementChild;
      observer.observe(element);

      return () => observer.disconnect();
    }
    return null;
  });

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

  function addLikeToStore({ id }) {
    // const { liked: likedArray, viewed: viewedArray } = JSON.parse($postLikedViewed);
    // postLikedViewed.set(
    //   JSON.stringify({ liked: [{ slug, id }, ...likedArray], viewed: viewedArray }),
    // );
  }

  function getLikeIdFromStore() {
    // const { liked: likedArray } = JSON.parse($postLikedViewed);
    // const { id } = likedArray.find((element: { slug: string }) => slug === element.slug);
    // return id ? id : '';
  }

  function removeLikeFromStore() {
    // const { liked: likedArray, viewed: viewedArray } = JSON.parse($postLikedViewed);
    // const index = likedArray.findIndex((element: { slug: string }) => slug === element.slug);
    // postLikedViewed.set(
    //   JSON.stringify({
    //     liked: [...likedArray.slice(0, index), ...likedArray.slice(index + 1)],
    //     viewed: viewedArray,
    //   }),
    // );
  }

  const handleLike = async () => {
    try {
      if (!ssr) {
        const responsePromise = fetch(`${workerUrl}/post/like`, {
          method: 'POST',
          credentials: 'omit',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: !liked ? '' : getLikeIdFromStore(),
            slug,
            unlike: liked,
          }),
        });
        const responseResult = await responsePromise;
        const { id, likes: incomingLikes } = await responseResult.json();
        if (!liked) {
          addLikeToStore({ id });
        } else {
          removeLikeFromStore();
        }
        setFreshLikeCount(incomingLikes);
      }
    } catch (error) {
      console.error(`Error in handleLike: ${error}`);
    }
  };

  const likesPromise = getViewsLikes() ?? { likes, views };

  const interactiveMeta =
    liked || likeButtonHover ? (
      <span className={icon}>
        <LikedIcon label="likes - already liked by you" />
      </span>
    ) : (
      <NotYetLikedIcon label="likes - not yet liked by you" />
    );
  const staticMeta = liked ? (
    <div className={icon}>
      <LikedIcon label="likes - already liked by you" />
    </div>
  ) : (
    <div className={icon}>
      <NotYetLikedIcon label="likes - not yet liked by you" />
    </div>
  );

  const likeButtonLabel = !liked ? 'Like this blog post' : 'Unlike this blog post';

  return (
    <aside className={`${container} ${containerClass ?? ''}`}>
      <div className={`${content} ${contentClass ?? ''}`}>
        <span className={meta}>
          <span className={icon}>
            <ViewsIcon label="Views" />
          </span>
          {freshViewCount ?? views}
        </span>
        <span className={meta}>
          <span className={icon}>
            {interactive ? (
              <button
                aria-label={likeButtonLabel}
                type="button"
                className={likeButton}
                onClick={handleLike}
                onMouseEnter={() => {
                  setLikeButtonHover(true);
                }}
                onMouseLeave={() => {
                  setLikeButtonHover(false);
                }}
              >
                {interactiveMeta}
              </button>
            ) : (
              staticMeta
            )}
          </span>
          {freshLikeCount ?? likes}
        </span>
        {freshCommentCount ?? comments > 0 ? (
          <span className={meta}>
            {interactive ? (
              <a aria-label="Jump to comments" className={`${link} ${meta}`} href="#comments">
                <span className={icon}>
                  <CommentIcon label="comments" />
                </span>
                {freshCommentCount ?? comments}
              </a>
            ) : (
              <>
                <span className={icon}>
                  <CommentIcon label="comments" />
                </span>
                {freshCommentCount ?? comments}
              </>
            )}
          </span>
        ) : null}
      </div>
    </aside>
  );
};

export default PostViewsLikesPure;
