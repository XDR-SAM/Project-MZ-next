# 🚀 Makezaa - Modern Agency Website

A beautiful, fully responsive, and SEO-optimized website for **Makezaa**, built with **Next.js 15**, **Tailwind CSS**, and **shadcn/ui**.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?style=for-the-badge&logo=gsap)

## ✨ Features

### 🎨 **Modern Design**
- Clean, professional design with smooth animations
- Fully responsive across all devices
- Dark/light theme support
- Makezaa custom branding and color schemes

### ⚡ **Performance Optimized**
- Built with Next.js 15 App Router
- Static site generation (SSG) for blazing fast loading
- Optimized images and assets
- SEO-friendly with proper meta tags and structured data

### 🎭 **Smooth Animations**
- GSAP-powered animations
- Scroll-triggered animations
- Staggered content reveals
- Smooth page transitions

### 📱 **Responsive & Accessible**
- Mobile-first responsive design
- WCAG 2.1 compliant accessibility
- Keyboard navigation support
- Screen reader friendly

### 🔍 **SEO Ready**
- Centralized metadata management
- Open Graph and Twitter Card support
- Structured data (JSON-LD)
- Canonical URLs and sitemap ready

### 📝 **Content Management**
- MDX support for blog posts and case studies
- Easy content updates
- Dynamic routing for blog posts

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui & Magic UI
- **Animations**: GSAP
- **Content**: MDX
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/XDR-SAM/Project-MZ-next.git
   cd Project-MZ-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── about/             # About page
│   ├── blog/              # Blog pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── custom/            # Makezaa custom components
│   ├── landing/           # Landing page sections
│   ├── magicui/           # Magic UI components
│   └── ui/                # shadcn/ui components
├── content/               # MDX blog posts
├── data/                  # Static data (Case studies, etc.)
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
│   ├── metadata.ts        # SEO metadata config
│   ├── GSAPAnimations.ts  # Animation utilities
│   └── utils.ts           # Helper functions
└── public/                # Static assets
```

## 🎨 Customization

### Branding
1. **Update the logo** in `components/custom/Navbar.tsx`
2. **Change colors** in `tailwind.config.js` and `app/globals.css`
3. **Update site info** in `lib/metadata.ts`

### Content
1. **Homepage sections** in `components/landing/`
2. **About page** in `app/about/page.tsx`
3. **Blog posts** in `content/` directory
4. **Case Studies** in `data/caseStudies.ts`

## 📝 Adding Blog Posts

1. Create a new `.mdx` file in the `content/` directory
2. Add frontmatter with required fields:
   ```mdx
   ---
   title: "Your Post Title"
   publishedAt: "2024-01-01"
   summary: "Brief description of your post"
   image: "/blog/your-image.jpg"
   tag: ["Tech", "Design"]
   ---
   
   Your post content here...
   ```

## 📄 License

This project is private and owned by **Makezaa**.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [GSAP](https://greensock.com/gsap/)
- [Magic UI](https://magicui.design/)

## 📞 Contact

- 🌐 **Website**: [makezaa.com](https://makezaa.com)
- 📧 **Email**: [contact@makezaa.com](mailto:hello@makezaa.com)
