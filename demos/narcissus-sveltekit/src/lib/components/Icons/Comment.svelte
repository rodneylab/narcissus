<script lang="ts">
  import Icon from 'svelte-awesome/components/Icon.svelte';
  import { faCommentAlt } from '@fortawesome/free-regular-svg-icons';
  export let label: string;
</script>

<Icon data={faCommentAlt} {label} />
