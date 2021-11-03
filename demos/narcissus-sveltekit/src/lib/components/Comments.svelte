<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import {
    authorText,
    commentContainer,
    commentContent,
    commentListItem,
    dateText,
  } from '$lib/components/Comments.css';
  import dayjs from 'dayjs';
  import 'dayjs/locale/en-gb.js';
  import localizedFormat from 'dayjs/plugin/localizedFormat.js';
  import relativeTime from 'dayjs/plugin/relativeTime.js';

  export let comments: { created_at: string; author: string; text: string }[];

  dayjs.extend(localizedFormat);
  dayjs.extend(relativeTime);
  dayjs.locale('en-gb');
</script>

{#if comments.length > 0}
  <section>
    <h2 id="comments">Visitor Comments</h2>
    <ul>
      {#each comments as { created_at: date, author, text }}
        <li class={commentListItem}>
          <Card containerClass={commentContainer} contentClass={commentContent}>
            <h3 class={authorText}>{author}</h3>
            <!-- {@html text} -->
            {text}
            <div>
              <small class={dateText}>
                {dayjs(date).fromNow()}
              </small>
            </div>
          </Card>
        </li>
      {/each}
    </ul>
  </section>
{/if}
