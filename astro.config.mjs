// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

const site = 'https://vfs-docs.netlify.app';

export default defineConfig({
	site,
	integrations: [
		starlight({
			title: 'vfs',
			description:
				'Virtual Function Signatures — extract exported signatures from source code with bodies stripped. Save 60-70% tokens for AI coding agents.',
			logo: {
				src: './src/assets/vfs.png',
			},
			components: {
				Hero: './src/components/Hero.astro',
				Sidebar: './src/components/Sidebar.astro',
				Head: './src/components/Head.astro',
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/TrNgTien/vfs',
				},
			],
			head: [
				{
					tag: 'meta',
					attrs: { property: 'og:type', content: 'website' },
				},
				{
					tag: 'meta',
					attrs: { property: 'og:site_name', content: 'vfs — Virtual Function Signatures' },
				},
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: `${site}/og-image.png` },
				},
				{
					tag: 'meta',
					attrs: { property: 'og:image:width', content: '1200' },
				},
				{
					tag: 'meta',
					attrs: { property: 'og:image:height', content: '630' },
				},
				{
					tag: 'meta',
					attrs: { property: 'og:image:alt', content: 'vfs — extract exported signatures from source code. Save 60-70% tokens for AI agents.' },
				},
				{
					tag: 'meta',
					attrs: { name: 'twitter:card', content: 'summary_large_image' },
				},
				{
					tag: 'meta',
					attrs: { name: 'twitter:image', content: `${site}/og-image.png` },
				},
				{
					tag: 'meta',
					attrs: { name: 'twitter:image:alt', content: 'vfs — extract exported signatures from source code. Save 60-70% tokens for AI agents.' },
				},
				{
					tag: 'meta',
					attrs: { name: 'author', content: 'TrNgTien' },
				},
				{
					tag: 'meta',
					attrs: { name: 'keywords', content: 'vfs, virtual function signatures, AI coding, token savings, code search, AST parser, MCP, Cursor, Claude Code, Windsurf, Cline, Aider, tree-sitter, Go, TypeScript, Python, Rust' },
				},
				{
					tag: 'link',
					attrs: { rel: 'canonical', href: site },
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
		sitemap(),
	],
});
