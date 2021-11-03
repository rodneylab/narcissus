import { browser } from '$app/env';
import { writable } from 'svelte/store';

const defaultValue = JSON.stringify({ liked: [], viewed: [] });

function makeJsonValid(json) {
  try {
    JSON.parse(json);
  } catch (error) {
    return defaultValue;
  }
  return json;
}

export const postLikedViewed = writable(
  browser ? makeJsonValid(localStorage.liked) || defaultValue : defaultValue,
);

postLikedViewed.subscribe((value) => {
  if (browser) {
    localStorage.likedViewed = JSON.stringify(value);
  }
});
