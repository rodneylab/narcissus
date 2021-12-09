import type { JSX } from 'react';
import SocialIcons from '$components/SocialIcons';
import {
  cardContainer,
  cardContent,
  contactAddress,
  contactDetails,
  contactDetailsList,
  contactDetailsListItem,
} from '$components/ContactsCard.css';
import website from '$configuration/website';
import { ThemeProvider, useTheme } from '$hooks/themeContext';
import Card from '$components/Card';
import ExternalLink from '$components/ExternalLink';

const width = 36;
const height = 36;

const { contactEmail, facebookPageName, telegramUsername, twitterUserId, twitterUsername } =
  website;

const ContactsCard = function ContactsCard(): JSX.Element {
  const {
    state: { theme },
  } = useTheme();

  const fgColor = theme === 'light' ? '#433633' : '#32021f';
  return (
    <Card containerClass={cardContainer} contentClass={cardContent}>
      <div className={contactDetails}>
        <ul className={contactDetailsList}>
          <li className={contactDetailsListItem}>
            <SocialIcons
              network="email"
              width={width}
              height={height}
              fgColor={fgColor}
              bgColor="transparent"
            />
            <span className={contactAddress}>{contactEmail}</span>
          </li>
          <li className={contactDetailsListItem}>
            <SocialIcons
              network="facebook"
              width={width}
              height={height}
              fgColor={fgColor}
              bgColor="transparent"
            />
            <ExternalLink
              aria-label="D M Rodney Lab on Facebook Messenger"
              href={`https://m.me.${facebookPageName}`}
            >
              <span className={contactAddress}> {facebookPageName}</span>
            </ExternalLink>
          </li>
          <li className={contactDetailsListItem}>
            <SocialIcons
              network="twitter"
              width={width}
              height={height}
              fgColor={fgColor}
              bgColor="transparent"
            />
            <ExternalLink
              aria-label="D M Rodney Lab on Twitter"
              href={`https://twitter.com/messages/compose?recipient-id=${twitterUserId}`}
            >
              <span className={contactAddress}>@{twitterUsername}</span>
            </ExternalLink>
          </li>
          <li className={contactDetailsListItem}>
            <SocialIcons
              network="telegram"
              width={width}
              height={height}
              fgColor={fgColor}
              bgColor="transparent"
            />
            <ExternalLink
              aria-label="Message Rodney Lab on Telegram"
              href={`https://t.me/${telegramUsername}`}
            >
              <span className={contactAddress}>{telegramUsername}</span>
            </ExternalLink>
          </li>
        </ul>
      </div>
    </Card>
  );
};

const ThemeWrapper = function ThemeWrapper(): JSX.Element {
  return (
    <ThemeProvider>
      <ContactsCard />
    </ThemeProvider>
  );
};

export default ThemeWrapper;
