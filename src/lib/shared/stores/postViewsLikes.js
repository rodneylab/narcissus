import { browser } from '$app/env';
import { writable } from 'svelte/store';

export const postViewsLikes = writable(browser ? localStorage.liked || '' : '');

postViewsLikes.subscribe((value) => {
  if (browser) {
    localStorage.liked = value;
  }
});
