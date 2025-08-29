# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 project using the App Router architecture, bootstrapped with `create-next-app`. The application uses React 19, TypeScript, and Tailwind CSS v4 with Turbopack for enhanced development performance.

## Development Commands

- **Development server**: `npm run dev` (uses Turbopack for faster builds)
- **Production build**: `npm run build` (uses Turbopack)
- **Start production server**: `npm start`

The development server runs on http://localhost:3000 by default.

## Project Structure

- **App Router**: Uses Next.js App Router with the `src/app` directory structure
- **TypeScript paths**: Configured with `@/*` alias pointing to `./src/*`
- **Styling**: Tailwind CSS v4 with PostCSS configuration
- **Fonts**: Uses Geist and Geist Mono fonts from Google Fonts
- **Static assets**: Located in the `public/` directory

## Key Architecture Details

- **Layout system**: Root layout in `src/app/layout.tsx` handles global fonts, metadata, and HTML structure
- **Main page**: Entry point is `src/app/page.tsx` with a responsive grid layout
- **TypeScript configuration**: Strict mode enabled with Next.js plugin integration
- **CSS variables**: Font families are available as CSS variables (`--font-geist-sans`, `--font-geist-mono`)

## Development Notes

- The project uses Turbopack in both development and build modes for improved performance
- Tailwind CSS v4 is configured through PostCSS with the `@tailwindcss/postcss` plugin
- TypeScript is configured with strict mode and modern ES2017 target
- The application supports both light and dark themes through Tailwind's dark mode utilities