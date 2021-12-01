import React from 'react';
import type { FC } from 'react';
import {
  cardContainer,
  cardContent,
  extraSummaryText,
  summaryHeading,
  summaryText,
} from './AboutCard.css';
import Card from './Card';

interface AboutCardProps {}

const AboutCard: FC<AboutCardProps> = function AboutCard() {
  return (
    <Card containerClass={cardContainer} contentClass={cardContent}>
      <h2 className={summaryHeading}>
        <span>About Narcissus</span>
      </h2>
      <p className={summaryText}>
        Narcissus is a proof of concept <strong>backend as a service</strong> app which lets you
        create a blog site quicker by managing important blog features like
        <strong>comment and message forms</strong>
        as well as post
        <strong>views and likes</strong>.
      </p>
      <p className={extraSummaryText}>
        This demo <strong>Astro</strong> site is static and uses Serverless
        <strong>Rust Cloudflare Workers</strong>
        to read and create comments as well as other interactive elements using REST requests,
        adding spam detection and Captchas without the added hassle of adding spam detection and
        Captchas. The app is backed by a <strong>Supabase</strong> PostgreSQL database.
      </p>
    </Card>
  );
};

export default AboutCard;
