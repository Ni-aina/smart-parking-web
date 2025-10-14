import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '25mb'
        }
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "vhigwhnrvzqtblknamtn.supabase.co"
            }
        ]
    }
}

export default nextConfig;
