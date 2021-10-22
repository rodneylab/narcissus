<script>
  import dayjs from 'dayjs';
  import 'dayjs/locale/en-gb';
  import localizedFormat from 'dayjs/plugin/localizedFormat';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import Card from '$lib/components/Card.svelte';

  export let comments;

  dayjs.extend(localizedFormat);
  dayjs.extend(relativeTime);
  dayjs.locale('en-gb');
</script>

<h2>Comments</h2>
<ul>
  {#each comments as { created_at: date, author, text }}
    <li>
      <Card>
        <h3>{author}</h3>
        <p>{text}</p>
        <div>
          <small>
            {dayjs(date).fromNow()}
          </small>
        </div>
      </Card>
    </li>
  {/each}
</ul>
