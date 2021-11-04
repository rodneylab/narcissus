<script lang="ts">
  import { COPYRIGHT_ENTITY } from '$lib/constants/entities';
  import RodneyLabCredit from '$lib/components/Layout/RodneyLabCredit.svelte';
</script>

<footer>
  <div>
    Created by <a
      aria-label="Open the Rodney Lab site"
      href="https://rodneylab.com/"
      target="_blank"
      rel="noopener noreferrer">Rodney Lab</a
    >. Copyright {COPYRIGHT_ENTITY} 2021.
  </div>
  <RodneyLabCredit />
</footer>
