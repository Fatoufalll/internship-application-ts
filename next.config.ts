import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "bidouillesetinformatique.fr",
    },
  ],
},
  /* config options here */
};

export default nextConfig;
export interface Params {
  params: { id: string; };
}
