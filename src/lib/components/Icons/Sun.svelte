<script lang="ts">
  import Icon from 'svelte-awesome/components/Icon.svelte';
  import { faSun } from '@fortawesome/free-solid-svg-icons';

  export let label: string;
  export let scale: number = 1;
</script>

<Icon data={faSun} {label} {scale} />
