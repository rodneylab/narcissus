<script lang="ts">
  import Icon from 'svelte-awesome/components/Icon.svelte';
  import { faEye } from '@fortawesome/free-solid-svg-icons';

  export let label: string;
</script>

<Icon data={faEye} {label} />
