const facebookPageName = import.meta.env ? (import.meta.env.VITE_FACEBOOK_PAGE as string) : '';
const facebookAuthorPageName = import.meta.env
  ? (import.meta.env.VITE_FACEBOOK_AUTHOR_PAGE as string)
  : '';

const website = {
  author: 'Rodney Johnson',
  entity: 'Rodney Lab',
  ogLanguage: 'en_GB',
  siteLanguage: 'en-GB',
  siteTitle: 'Narcissus Blog',
  siteShortTitle: 'Narcissus',
  siteUrl: import.meta.env ? (import.meta.env.VITE_SITE_URL as string) : '',
  icon: 'static/icon.png',
  backgroundColor: '#1b4079',
  themeColor: '#fcfdfd',
  contactEmail: import.meta.env ? (import.meta.env.VITE_CONTACT_EMAIL as string) : '',
  facebookAuthorPage: `https://www.facebook.com/${facebookAuthorPageName}`,
  facebookAuthorPageName,
  facebookPage: `https://www.facebook.com/${facebookPageName}`,
  facebookPageName,
  githubPage: import.meta.env ? (import.meta.env.VITE_GITHUB_PAGE as string) : '',
  linkedinProfile: import.meta.env ? (import.meta.env.VITE_LINKEDIN_PROFILE as string) : '',
  telegramUsername: import.meta.env ? (import.meta.env.VITE_TELEGRAM_USERNAME as string) : '',
  tiktokUsername: import.meta.env ? (import.meta.env.VITE_TIKTOK_USERNAME as string) : '',
  twitterUsername: import.meta.env ? (import.meta.env.VITE_TWITTER_USERNAME as string) : '',
  twitterUserId: import.meta.env ? (import.meta.env.VITE_TWITTER_ID as string) : '',
  wireUsername: import.meta.env ? (import.meta.env.VITE_WIRE_USERNAME as string) : '',
  hcaptchaSitekey: import.meta.env ? (import.meta.env.VITE_HCAPTCHA_SITEKEY as string) : '',
  workerUrl: import.meta.env ? (import.meta.env.VITE_WORKER_URL as string) : '',
};

export { website as default };
