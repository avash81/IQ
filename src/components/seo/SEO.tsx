import * as React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  keywords?: string;
}

export function SEO({
  title = 'Free IQ Test Online — Instant Age-Normalized Score | IQTest Pro',
  description = 'Take the world\'s most accurate free IQ test. Get your instant, age-normalized IQ score across 5 cognitive domains. No registration. Free certificate. 2.8M+ tests taken.',
  canonical,
  ogImage = '/og-image.png',
  keywords = "free IQ test, online IQ test, IQ test 2025, IQ score, intelligence test, cognitive test, age normalized IQ, free intelligence test, IQ test with results, IQ scale, what is my IQ",
}: SEOProps) {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://iqtestpro.com';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const fullOgImage = `${siteUrl}${ogImage}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonical} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content="IQTest Pro" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@iqtestpro" />
      <meta name="twitter:creator" content="@iqtestpro" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
    </Helmet>
  );
}
