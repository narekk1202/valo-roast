import type { Metadata } from 'next';
import { ThemeProvider } from '@/shared/providers/theme-provider';
import { IBM_Plex_Mono, IBM_Plex_Sans, Teko } from 'next/font/google';
import './globals.css';

const fontSans = IBM_Plex_Sans({
	subsets: ['latin'],
	weight: ['400', '500', '600'],
	variable: '--font-ibm-sans',
});

const fontHeading = Teko({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	variable: '--font-teko',
});

const fontMono = IBM_Plex_Mono({
	subsets: ['latin'],
	weight: ['400', '500'],
	variable: '--font-ibm-mono',
});

export const metadata: Metadata = {
	title: {
		default: 'ValoRoast',
		template: '%s · ValoRoast',
	},
	description: 'Enter your Riot ID and find out how bad you are.',
	openGraph: {
		title: 'ValoRoast',
		description: 'Enter your Riot ID and find out how bad you are.',
		type: 'website',
	},
	twitter: {
		card: 'summary',
		title: 'ValoRoast',
		description: 'Enter your Riot ID and find out how bad you are.',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='en'
			className={`${fontSans.variable} ${fontHeading.variable} ${fontMono.variable} dark`}
			suppressHydrationWarning
		>
			<body className='font-sans antialiased'>
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					enableSystem={false}
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
