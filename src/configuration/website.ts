const facebookPageName: string = import.meta.env?.SNOWPACK_PUBLIC_FACEBOOK_PAGE ?? '';
const facebookAuthorPageName: string = import.meta.env?.SNOWPACK_PUBLIC_FACEBOOK_AUTHOR_PAGE ?? '';

const website = {
  // author: 'Rodney Johnson',
  // entity: 'Rodney Lab',
  // ogLanguage: 'en_GB',
  // siteLanguage: 'en-GB',
  // siteTitle: 'Narcissus Blog',
  // siteShortTitle: 'Narcissus',
  // siteUrl: import.meta.env ? (import.meta.env.VITE_SITE_URL as string) : '',
  // icon: 'static/icon.png',
  // backgroundColor: '#1b4079',
  // themeColor: '#fcfdfd',
  contactEmail: import.meta.env?.SNOWPACK_PUBLIC_CONTACT_EMAIL ?? '',
  facebookAuthorPage: `https://www.facebook.com/${facebookAuthorPageName}`,
  facebookAuthorPageName,
  facebookPage: `https://www.facebook.com/${facebookPageName}`,
  facebookPageName,
  githubPage: import.meta.env?.SNOWPACK_PUBLIC_GITHUB_PAGE ?? '',
  linkedinProfile: import.meta.env?.SNOWPACK_PUBLIC_LINKEDIN_PROFILE ?? '',
  telegramUsername: import.meta.env?.SNOWPACK_PUBLIC_TELEGRAM_USERNAME ?? '',
  tiktokUsername: import.meta.env?.SNOWPACK_PUBLIC_TIKTOK_USERNAME ?? '',
  twitterUsername: import.meta.env?.SNOWPACK_PUBLIC_TWITTER_USERNAME ?? '',
  twitterUserId: import.meta.env?.SNOWPACK_PUBLIC_TWITTER_ID ?? '',
  wireUsername: import.meta.env?.SNOWPACK_PUBLIC_WIRE_USERNAME ?? '',
  hcaptchaSitekey: import.meta?.env.SNOWPACK_PUBLIC_HCAPTCHA_SITEKEY ?? '',
  workerUrl: import.meta.env?.SNOWPACK_PUBLIC_WORKER_URL ?? '',
};

export { website as default };
