import React, { createContext, useContext, useMemo, useReducer } from 'react';
import type { FC, ReactNode } from 'react';

type Dispatch = () => void;
type State = { liked: { slug: string; id: string }[]; viewed: string[] };
interface LikedViewedProviderProps {
  children: ReactNode;
}

const LikedViewedContext = createContext<{ state: State; dispatch: Dispatch } | undefined>(
  undefined,
);

function likedViewedReducer(state: State, action) {
  const { id, slug } = action.payload;

  switch (action.type) {
    case 'add-like': {
      return { liked: [...state.liked, { id, slug }], viewed: state.viewed };
    }
    case 'add-view': {
      return { liked: state.liked, viewed: [...state.viewed, slug] };
    }
    case 'remove-like': {
      const { liked, viewed } = state;
      const index = liked.findIndex((element) => slug === element.slug);
      return { liked: [...liked.slice(0, index), ...liked.slice(index + 1)], viewed };
    }
    default: {
      throw new Error(`Unhandled action type on likedViewedReducer: ${action.type}`);
    }
  }
}

const LikedViewedProvider: FC<LikedViewedProviderProps> = function LikedViewedProvider({
  children,
}) {
  const [state, dispatch] = useReducer(likedViewedReducer, {
    liked: [],
    viewed: [],
  });
  const value = useMemo(() => ({ state, dispatch }), [dispatch, state]);
  return <LikedViewedContext.Provider value={value}>{children}</LikedViewedContext.Provider>;
};

function useLikedViewed() {
  const context = useContext(LikedViewedContext);
  if (context === undefined) {
    throw new Error('useLikedViewed must be used within a LikedViewedProvider');
  }
  return context;
}

export { LikedViewedProvider, useLikedViewed };
