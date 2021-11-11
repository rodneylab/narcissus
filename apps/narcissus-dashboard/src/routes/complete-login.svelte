<script context="module">
  export async function load({ fetch, session }) {
    try {
      if (session.user) {
        return {
          redirect: '/dashboard',
          status: 302,
        };
      }
      await fetch('/api/user', {
        method: 'GET',
        credentials: 'include',
      });
      return {
        redirect: '/dashboard',
        status: 302,
      };
    } catch (error) {
      console.error(`Error on route /complete-login: ${error}`);
    }
  }
</script>
