<img src="./images/rodneylab-github-narcissus.png" alt="Rodney Lab narcissus Github banner">

<p align="center">
  <a aria-label="Open Rodney Lab site" href="https://rodneylab.com" rel="nofollow noopener noreferrer">
    <img alt="Rodney Lab logo" src="https://rodneylab.com/assets/icon.png" width="60" />
  </a>
</p>
<h1 align="center">
  Narcissus &mdash; Backendless Blog API as a Service
</h1>

Narcissus is a proof of concept **backend as a service** app which lets you create a blog site quicker by managing important blog features like **comment and message forms** as well as post **views and likes**.  You create the styling and implementation your way on your preferred framework and just use the API to connect the data your site needs.  The API runs on **Rust Cloudflare Workers** interfacing with a **Supabase** PostgreSQL database and packs features like bot and spam detection.  We also use bots for good &mdash; a **Telegram bot** sends you contact form messages! There is a <a aria-label="Open the narcissus blog repo on Git Hub" href="https://github.com/rodneylab/narcissus-blog">demo frontend built in SvelteKit</a> with the demo site <a aria-label="Open the demo site" href="https://narcissus-blog.rodneylab.com/contact/">running on Cloudflare Pages at narcissus-blog.rodneylab.com</a>.

## Features

These features are provided by REST endpoints which the Rust Cloudflare Worker listens on:

- **Message form** &mdash; lets website visitors send a message to admins. To avoid abuse by bots <a aria-label="Learn more about h Captcha" href="https://www.hcaptcha.com/">hCaptcha runs a challenge</a> in browser. On the Cloudflare worker side, there is also a check with the <a aria-label="Learn more about Akismet" href="https://akismet.com/">Akismet spam detection service</a>. The worker sends you or admins the details of the message using a Telegram bot.

- **View count** &mdash; pages views are counted automatically and displayed, letting visitors know what the most popular content&nbsp;is.

- **Likes** &mdash; the <a aria-label="Open the narcissus repo on Git Hub" href="https://github.com/rodneylab/narcissus">Cloudflare worker</a> records new blog post likes to a <a aria-label="Learn more about Supa base" href="https://supabase.io/">Supabase</a> database.

- **Comments** &mdash; comments left by users on blog posts, like contact form messages are checked for spam and bots.

- **Developer friendly** &mdash; you style the pages and implement any or all of the features the way you want. Just fetch data from the **API using REST** calls. Your site becomes **backendless** and you save on having to configure and connect multiple services.

## Possible Future Features

- Newsletter subscription handling, connecting to your preferred service.

- GraphQL API.

- Alternative <a aria-label="Learn more about Astro" href="https://astro.build/">demo site built with Astro</a>.

## Trying it Out

You will need a Cloudflare account as well as an Akismet, hCaptcha and Telegram Bot API key to use all features.  These services all have a free tier and there are details below on how you can set them up.

1. Start by cloning this repo:

    ```shell
    git clone https://github.com/rodneylab/narcissus
    cd narcissus
    ```

1. Continue by <a aria-label="Create a Cloudflare account" href="https://dash.cloudflare.com/sign-up">setting up a Cloudflare account</a> if you do not yet have one.

1. Now get you can get API keys for Akismet, hCaptcha and Telegram.  Follow these links for instructions:

    - <a aria-label="Get Akismet API keys" href="https://akismet.com/plans/" rel="nofollow noopener noreferrer" target="_blank">Akismet</a>
    -  <a aria-label="Visit the h captcha site to create an account" href="https://www.hcaptcha.com/" rel="nofollow noopener noreferrer" target="_blank">hCaptcha account</a>,
    - <a aria-label="Open article on getting Telegram bot A P I keys" href="https://rodneylab.com/gatsby-functions-netlify/#telegramAPIKeys" rel="nofollow noopener noreferrer" target="_blank">a Telegram Bot</a>.

1. If you do not yet have a Rust development environment set up on your machine,  <a aria-label="See recommended rust up installation instructions" href="https://www.rust-lang.org/tools/install" rel="nofollow noopener noreferrer" target="_blank">head over to the official Rust site for the recommended one-line terminal command</a> to get that up and running.

1. Install the wrangler tool on your machine:

    ```shell
    cargo install wrangler
    ```

1. Next link your Cloudflare account to your local environment:

    ```shell
    wrangler login
    ```

1. Now we will define some variables.  Start with your Akismet API key:

    ```shell
    wrangler secret put AKISMET_API_KEY
    ```

    paste in your API key when prompted.

1. Repeat with the following keys:

    ```shell
    wrangler secret put HCAPTCHA_SECRETKEY
    wrangler secret put HCAPTCHA_SITEKEY
    wrangler secret put SUPABASE_URL
    wrangler secret put SUPABASE_SERVICE_API_KEY
    wrangler secret put TELEGRAM_BOT_API_TOKEN
    wrangler secret put TELEGRAM_BOT_CHAT_ID
    ```

    we also need the url of your user site (e.g. "http://example.com") for Akismet spam detection:

    ```shell
     wrangler secret put SITE_URL
    ```

1. Finally we will define the CORS origins.  This is a comma separated list of valid domains you want to be able to send requests from (typically your live client site and a local development site).  If you have the the following domains:

    - https://www.example.com,
    - http://127.0.0.1:3000,


    Enter the secret as `https://www.example.com,http://127.0.0.1:3000` when prompted.

    Let's define this now then:

    ```
    wrangler secret put CORS_ORIGIN
    ```

1. Be sure to add appropriate disclaimers and information on privacy policies and terms of use on any sites you link up.

That should be everything set up.

## Testing

To test you can build the SvelteKit demo site, create you own new site in your framework of preference or update an existing site.

As an example, using `fetch` in JavaScript, you can query the data endpoint like so

```javascript
const response = await fetch(`${process.env['VITE_WORKER_URL']}/post/data`, {
  method: 'POST',
  credentials: 'omit',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    slug,
  }),
});
const data = await response.json();
const { comments, likes, views } = data;
```

Endpoints:
- `post/data` get the likes, views and comments for a particular blog post:
    <dl>
      <dt>method</dt><dd>POST</dd>
      <dt>input</dt><dd>JSON object: <code>{ "slug": "example-post-slug-to-identify-post" }</code></dd>
      <dt>response</dt><dd>JSON object:
        <code class="language-json">
        {
          "likes": 53,
          "views": 598 ,
          "comments": [
            [
              {
                "uid": "66df2153-0db5-4c90-a04f-652fbf93098a",
                "created_at": "2021-10-20T04:01:07.753+00:00",
                "updated_at": "2021-10-20T04:01:07.753+00:00",
                "author": "John",
                "text": "Hello, just  a test comment",
              },
              {
                "uid": "cb090530-9b2a-4a53-a9cf-f974b9fe8bb6",
                "created_at": "2021-10-20T04:28:38.973051+00:00",
                "updated_at": "2021-10-20T04:28:38.973051+00:00",
                "author": "Matthew",
                "text": "Another test comment",
              }
            ]
          ],
        }
        </code>
      </dd>
    </dl>

- `post/comment` submit a new comment for a particular blog post:
    <dl>
      <dt>method</dt><dd>POST</dd>
      <dt>input</dt><dd>JSON object:

        ```json
        {
          "author": "River Costa",
          "text": "Comment text",
          "email": "person@example.com",
          "response": "This is the hCaptcha response received in the client browser on completing the challenge",
          "slug": "example-post-slug-to-identify-post"
        }
        ```
      </dd>
      <dt>response</dt><dd>400 status code if everything is good</dd>
    </dl>
    Email is only used with Akismet for spam detection as is not stored to the database.

- `post/like` submit a new like or rescind an existing one for a particular blog post:
    <dl>
      <dt>method</dt><dd>POST</dd>
      <dt>input</dt><dd>JSON object:

        ```json
        {
          "id": "id of like being deleted or empty string for a new like",
          "unlike": "boolean true is like is being deleted and false otherwise",
          "slug": "example-post-slug-to-identify-post"
        }
        ```
      </dd>
      <dt>response</dt><dd>JSON object:

        ```json
        {
          "likes": 53,
          "id": "string: id of new like (needed to rescind it later)",
        }
        ```
      </dd>
    </dl>

- `post/message` submit a message, for example from a contact page message form:
    <dl>
      <dt>method</dt><dd>POST</dd>
      <dt>input</dt><dd>JSON object:

        ```json
        {
          "name": "River Costa",
          "text": "Message text",
          "email": "person@example.com",
          "response": "This is the hCaptcha response received in the client browser on completing the challenge",
        }
        ```
      </dd>
      <dt>response</dt><dd>400 status code if everything is good</dd>
    </dl>
    The message details are forwarded by the Telegram bot including spam check result.

- `post/view` submit a view, for example once the user has scrolled part way down the page of a blog post:

    <dl>
      <dt>method</dt><dd>POST</dd>
      <dt>input</dt><dd>JSON object:

        ```json
        {
          "slug": "example-post-slug-to-identify-post"
        }
        ```
      </dd>
      <dt>response</dt><dd>JSON object:

        ```json
        {
          "views": 599,
        }
        ```
        </dd>
    </dl>

## Setup

Supabase data schema - to be added.

## Troubleshooting

- **CORS** &mdash; if you get CORS issues testing out hCaptcha locally, <a aria-label="See hCaptcha tips on avoiding CORS issues" href="https://docs.hcaptcha.com/#local-development">try their recommended solution</a>.
