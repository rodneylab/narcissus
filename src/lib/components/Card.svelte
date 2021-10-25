<script lang="ts">
  export let containerClass: string = undefined;
  export let contentClass: string = undefined;
  import { container, content } from '$lib/components/Card.css';
</script>

<section class={`${container} ${containerClass ?? ''}`}>
  <div class={`${content} ${contentClass ?? ''}`}>
    <slot />
  </div>
</section>
