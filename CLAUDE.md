# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a demo repository for building with AI, built as a Next.js application.

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm
- **Linting**: ESLint with Next.js configuration

## Development Commands

```bash
pnpm dev      # Start development server (http://localhost:3000)
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Project Structure

```
/
├── app/                 # Next.js App Router directory
│   ├── layout.tsx      # Root layout component
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles with Tailwind
├── public/             # Static assets (auto-created by Next.js)
├── next.config.ts      # Next.js configuration
├── tsconfig.json       # TypeScript configuration
├── tailwind.config.ts  # Tailwind CSS configuration
└── package.json        # Dependencies and scripts
```

## Key Dependencies

- **next**: React framework for production-grade applications
- **react** & **react-dom**: React library for building UI
- **typescript**: Type-safe JavaScript
- **tailwindcss**: Utility-first CSS framework
- **eslint**: Code quality and style checking
