import type { JSX } from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import website from '$configuration/website';
import {
  container,
  content,
  icon,
  likeButton,
  link,
  meta,
} from '$components/PostViewsLikesPure.css';
import NotYetLikedIcon from '$components/Icons/HeartOutline';
import LikedIcon from '$components/Icons/HeartSolid';
import ViewsIcon from '$components/Icons/View';
import CommentIcon from '$components/Icons/Comment';
import { LikedViewedProvider, useLikedViewed } from '$hooks/postLikedViewedContext';

interface PostViewsLikesPureProps {
  likes: number;
  views: number;
  slug: string;
  comments: number;
  containerClass: string;
  contentClass: string;
  interactive: boolean;
}

const PostViewsLikesPure = function PostViewsLikesPure({
  likes,
  views,
  slug,
  comments,
  containerClass = undefined,
  contentClass = undefined,
  interactive = true,
}: PostViewsLikesPureProps): JSX.Element {
  const {
    dispatch,
    state: { liked, viewed },
  } = useLikedViewed();

  const [freshLikeCount, setFreshLikeCount] = useState(null);
  const [freshViewCount, setFreshViewCount] = useState(null);
  const [freshCommentCount] = useState(null);
  const [likeButtonHover, setLikeButtonHover] = useState(false);

  // const ssr = import.meta.env.SSR;
  const ssr = typeof window === 'undefined';

  function postViewed() {
    return viewed.includes(slug);
  }

  function addViewToStore() {
    dispatch({ type: 'add-view', payload: { slug } });
  }

  const { workerUrl } = website;

  async function handleView() {
    try {
      if (!postViewed()) {
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

  async function updateViewsLikes() {
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
      const { likes: freshLikes, views: freshViews } = await response.json();
      setFreshLikeCount(freshLikes);
      setFreshViewCount(freshViews);
    } catch (error) {
      console.error(`Error in getViewsLikes: ${error}`);
    }
  }

  useEffect(() => {
    (async () => {
      await updateViewsLikes();
    })();
  }, []);

  function postLiked() {
    return liked.includes(slug);
  }

  function addLikeToStore({ id }) {
    dispatch({ type: 'add-like', payload: { slug, id } });
  }

  function getLikeIdFromStore() {
    const { id } = liked.find((element) => slug === element.slug);
    return id ?? '';
  }

  function removeLikeFromStore() {
    dispatch({ type: 'remove-like', payload: { slug } });
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
            id: !postLiked() ? '' : getLikeIdFromStore(),
            slug,
            unlike: postLiked(),
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

  const likeButtonLabel = !postLiked ? 'Like this blog post' : 'Unlike this blog post';

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

const LikedViewedWrapper = function LikedViewedWrapper({
  likes,
  views,
  slug,
  comments,
  containerClass = undefined,
  contentClass = undefined,
  interactive = true,
}: PostViewsLikesPureProps) {
  return (
    <LikedViewedProvider>
      <PostViewsLikesPure
        likes={likes}
        views={views}
        slug={slug}
        comments={comments}
        containerClass={containerClass}
        contentClass={contentClass}
        interactive={interactive}
      />
    </LikedViewedProvider>
  );
};

export default LikedViewedWrapper;
