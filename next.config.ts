import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product photography is served from Shopify's CDN, so next/image has to
    // be told the host is allowed. Scoped to cdn.shopify.com and nothing else:
    // a wildcard here would let any URL in a Shopify field turn this site into
    // an open image proxy.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
