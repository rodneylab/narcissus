<script>
  import { container, content } from '$lib/components/Card.css';
</script>

<section class={container}>
  <div class={content}>
    <slot />
  </div>
</section>
