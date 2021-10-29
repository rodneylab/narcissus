<script lang="ts">
  import Icon from 'svelte-awesome/components/Icon.svelte';
  import { faMoon } from '@fortawesome/free-regular-svg-icons';
  export let label: string;
</script>

<Icon data={faMoon} {label} />
