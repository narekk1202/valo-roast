import type { NextConfig } from 'next';
import './app/env';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [{ hostname: 'media.valorant-api.com' }],
	},
};

export default nextConfig;
