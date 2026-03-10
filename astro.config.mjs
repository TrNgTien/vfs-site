// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://vfs-docs.netlify.app',
	integrations: [
		starlight({
			title: 'vfs',
			description:
				'Virtual Function Signatures — extract exported signatures from source code with bodies stripped. Save 60-70% tokens for AI coding agents.',
			logo: {
				src: './src/assets/vfs.png',
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/TrNgTien/vfs',
				},
			],
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{
					label: 'Start Here',
					items: [
						{ label: 'Introduction', slug: '' },
						{ label: 'Installation', slug: 'getting-started/installation' },
						{ label: 'Quick Start', slug: 'getting-started/quick-start' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'AI Tools Setup', slug: 'guides/ai-tools-setup' },
						{ label: 'Agent Rules', slug: 'guides/agent-rules' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'CLI Commands', slug: 'reference/cli' },
						{ label: 'Supported Languages', slug: 'reference/languages' },
						{ label: 'Benchmark', slug: 'reference/benchmark' },
						{ label: 'Security & Privacy', slug: 'reference/security' },
					],
				},
			],
		}),
	],
});
