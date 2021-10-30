<img src="./images/rodneylab-github-narcissus-blog.png" alt="Rodney Lab narcissus-blog Github banner">

<p align="center">
  <a aria-label="Open Rodney Lab site" href="https://rodneylab.com" rel="nofollow noopener noreferrer">
    <img alt="Rodney Lab logo" src="https://rodneylab.com/assets/icon.png" width="60" />
  </a>
</p>
<h1 align="center">
  Narcissus Blog
</h1>

Narcissus is a proof of concept **backend as a service** app which lets you create a blog site quicker by managing important blog features like **comment and message forms** as well as post **views and likes**.

This demo **Svelte** site is static and uses Serverless **Rust Cloudflare Workers** to read and create comments as well as other interactive elements using REST requests, adding spam detection and Captchas without the added hassle of adding spam detection and Captchas. The app is backed by a **Supabase** PostgreSQL database.

The demo site is <a aria-label="Open the demo site" href="https://narcissus-blog.rodneylab.com/contact/">running on Cloudflare Pages at narcissus-blog.rodneylab.com/</a>.

## Features

- **Message form** &mdash; lets visitors send a message to admins. To avoid abuse by bots <a aria-label="Learn more about h Captcha" href="https://www.hcaptcha.com/">hCaptcha runs a challenge</a> in browser. On the Cloudflare worker side, there is also a check with the <a aria-label="Learn more about Akismet" href="https://akismet.com/">Akismet spam detection service</a>. The worker sends you or admins the details of the message using a Telegram bot.

- **View count** &mdash; pages views are counted automatically and displayed, letting visitors know what the most popular content is.

- **Likes** &mdash; users can like blog posts. The <a aria-label="Open the narcissus repo on Git Hub" href="https://github.com/rodneylab/narcissus">Cloudflare worker</a> records new likes to a <a aria-label="Learn more about Supa base" href="https://supabase.io/">Supabase</a> database.

- **Comments** &mdash; comments left by users on blog posts, like contact form messages are checked for spam and bots.

- **Static build** &mdash; the functionality all works on a static site. Latest like comment and view data is sourced at build time, so the browser can display this meta even if JavaScript is disabled. With JavaScript enabled, the users pulls in fresh meta updates made since the last build.

- **Developer friendly** &mdash; you style the pages and implement any or all of the features the way you want. Just fetch data from the **API using REST** calls. Your site becomes **backendless** and you save on having to configure and connect multiple services.

## Possible Future Features

- Newsletter subscription handling, connecting to your preferred service.

- GraphQL API.

- Alternative <a aria-label="Learn more about Astro" href="https://astro.build/">demo site built with Astro</a>.

## Trying it Out

You can clone and build this demo SvelteKit site locally yourself:

1. Clone the repo:

```shell
git clone https://github.com/rodneylab/narcissus-blog.git
cd narcissus-blog
```

2. Copy the example the environment variables file and populate it with any of your own details:

```shell
cp .env.EXAMPLE .env
```

3. Install packages with pnpm, npm or yarn:

```shell
pnpm install # or npm install
```

4. Start up a development server:

```shell
pnpm run dev
```

5. Go to `http://localhost:3000` in your browser.

## Troubleshooting

- **CORS** &mdash; if you get CORS issues testing out hCaptcha locally, <a aria-label="See hCaptcha tips on avoiding CORS issues" href="https://docs.hcaptcha.com/#local-development">try their recommended solution</a>.
