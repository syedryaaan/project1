// NexaStore — Meta / SEO Component
import React from "react";
import { Helmet } from "react-helmet";

const DEFAULT_TITLE = "NexaStore — Premium Tech & Lifestyle Commerce";

const Meta = ({
  title = DEFAULT_TITLE,
  description = "Discover premium electronics, audio, gaming gear and lifestyle products at NexaStore. Fast shipping, easy returns.",
  keywords = "electronics, tech, gaming, audio, smartphones, premium products",
}) => {
  const safeTitle = title && title.trim() ? title.trim() : DEFAULT_TITLE;
  const fullTitle =
    safeTitle === DEFAULT_TITLE ? DEFAULT_TITLE : `${safeTitle} | NexaStore`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default Meta;
