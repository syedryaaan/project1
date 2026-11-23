// NexaStore — Meta / SEO Component
import React from "react";
import { Helmet } from "react-helmet";

const Meta = ({ title = "NexaStore — Premium Tech & Lifestyle Commerce", description = "Discover premium electronics, audio, gaming gear and lifestyle products at NexaStore. Fast shipping, easy returns.", keywords = "electronics, tech, gaming, audio, smartphones, premium products" }) => (
  <Helmet>
    <title>{title === "NexaStore — Premium Tech & Lifestyle Commerce" ? title : `${title} | NexaStore`}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
  </Helmet>
);

export default Meta;
