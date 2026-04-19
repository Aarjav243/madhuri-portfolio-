---
description: Full free SEO optimization for a Next.js portfolio or website
---

# SEO Optimization Workflow

Use this workflow to fully optimize any Next.js website for search engines at zero cost.
The goal is to make the website appear on Page 1 of Google when searched by name or topic.

---

## Step 1 — Gather Site Info

Before writing any code, collect these details from the user (ask if not provided):

1. **Full name / brand name** of the person or company the website is for
2. **Live URL** of the deployed website (e.g. `https://yourname.vercel.app/`)
3. **Job title / role** (e.g. "Professor of Economics", "Software Engineer")
4. **Affiliation / company** (e.g. "Krea University", "Google")
5. **Key topics / expertise** (e.g. "Supply Chain, Agri-business")
6. **Social/professional links** — LinkedIn, Google Scholar, ResearchGate, GitHub, etc.
7. **Profile photo filename** in the `/public` folder (e.g. `/profile_photo.jpg`)

---

## Step 2 — Inspect the Project Structure

Run the following to understand the tech stack:

```
view_file: package.json
list_dir: src/app/
```

Check:
- Is there a `layout.tsx` or `layout.js`? → That's where metadata goes.
- Is there a `page.tsx` or `page.js`? → That's where JSON-LD and semantic HTML goes.
- Does `robots.ts` / `sitemap.ts` already exist in `src/app/`?

---

## Step 3 — Enhance Metadata in `layout.tsx`

Edit `src/app/layout.tsx`. Replace or enhance the `export const metadata` object with:

```typescript
export const metadata: Metadata = {
  title: "[Full Name] | [Job Title] Portfolio",
  description: "Official portfolio of [Full Name] — [Job Title] at [Affiliation]. Expert in [Key Topics].",
  keywords: [
    "[Full Name]",
    "[Job Title]",
    "[Key Topic 1]",
    "[Key Topic 2]",
    "[Affiliation]",
    // Add 5-10 relevant keywords
  ],
  authors: [{ name: "[Full Name]" }],
  creator: "[Full Name]",
  openGraph: {
    type: "website",
    locale: "en_IN", // or en_US depending on location
    url: "[LIVE_URL]",
    title: "[Full Name] | [Job Title]",
    description: "...",
    siteName: "[Full Name] Portfolio",
    images: [
      {
        url: "[LIVE_URL]/[profile_photo.jpg]",
        width: 1200,
        height: 630,
        alt: "[Full Name]",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "[Full Name] | [Job Title]",
    description: "...",
    images: ["[LIVE_URL]/[profile_photo.jpg]"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification will be added in Step 6
};
```

---

## Step 4 — Create `robots.ts`

Create the file `src/app/robots.ts`:

```typescript
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "[LIVE_URL]/sitemap.xml",
  };
}
```

---

## Step 5 — Create `sitemap.ts`

Create the file `src/app/sitemap.ts`:

```typescript
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "[LIVE_URL_WITHOUT_TRAILING_SLASH]";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    // Add more routes if the site has multiple pages
    // { url: `${baseUrl}/projects`, ... },
  ];
}
```

---

## Step 6 — Inject JSON-LD Structured Data in `page.tsx`

In `src/app/page.tsx`, just before the `return (` statement, add the JSON-LD object:

```typescript
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",               // Use "Organization" for companies
  "name": "[Full Name]",
  "jobTitle": "[Job Title]",
  "affiliation": {
    "@type": "CollegeOrUniversity", // or "Organization"
    "name": "[Affiliation]"
  },
  "url": "[LIVE_URL]",
  "image": "[LIVE_URL]/[profile_photo.jpg]",
  "sameAs": [
    "[LinkedIn URL]",
    "[Google Scholar URL]",        // if applicable
    "[ResearchGate URL]",          // if applicable
    "[GitHub URL]",                // if applicable
  ],
  "description": "[One sentence description of the person/org]"
};
```

Then inside the JSX `return`, add as the **first child**:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

---

## Step 7 — Improve Semantic HTML

In `page.tsx`, make sure:
- The main scrollable wrapper uses `<main>` instead of `<div>` where appropriate
- The site's `<h1>` tag contains the person's full name
- All `<Image>` components have a descriptive `alt` attribute

---

## Step 8 — Commit and Push

```powershell
git add src/app/layout.tsx src/app/robots.ts src/app/sitemap.ts src/app/page.tsx
git commit -m "SEO: Add metadata, JSON-LD, sitemap, robots"
git push
```

Wait ~2 minutes for Vercel to deploy.

---

## Step 9 — Verify Sitemap is Live

Check: `[LIVE_URL]/sitemap.xml`

If it returns valid XML, the sitemap is working. If not, check `sitemap.ts` for errors.

---

## Step 10 — Google Search Console Setup

> **IMPORTANT FOR AGENTS:** Do NOT attempt to open the browser or navigate to Google Search Console yourself. You cannot log in on behalf of the user. Instead, give the user the exact step-by-step instructions below and wait for them to return with the verification token.

**Send this message to the user word for word:**

---

Please do these steps in Google Search Console — I'll handle the code part once you give me the token:

1. Go to → https://search.google.com/search-console/welcome
2. Under **"URL prefix"** (right side box), paste your website URL and click **Continue**
3. In the popup, find **"HTML tag"** and click to expand it
4. You'll see a line like: `<meta name="google-site-verification" content="abc123..." />`
5. Copy just the code inside `content="..."` and paste it here

**Once the user gives you the token**, add it to `layout.tsx`:

```typescript
// Add inside the metadata object, after the robots block:
verification: {
  google: "[TOKEN_FROM_USER]",
},
```

Commit and push again. Then tell the user to:
1. Click **"Verify"** in Search Console
2. Go to **Sitemaps** → type `sitemap.xml` → click **Submit**

---

## Step 11 — Verify Rich Results

Tell the user to test the JSON-LD implementation at:
👉 [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)

Enter the live URL. It should show "Person" structured data detected.

---

## Expected Timeline

| Milestone | Timeframe |
|---|---|
| Sitemap fetched by Google | 24–48 hours |
| Site appears in search index | 3–7 days |
| Name search shows website on Page 1 | 1–4 weeks |

---

## Notes for Agents

- **Never use `&&` in PowerShell** — use `;` to chain commands instead
- **Always restore from git** (`git checkout HEAD -- filename`) if a file gets corrupted rather than attempting incremental repairs
- The `"Couldn't fetch"` sitemap status in Search Console is **normal** — Google retries automatically within 24–48 hours
- For non-Next.js sites (plain HTML), add the meta tags directly in `<head>` of `index.html` and create a static `sitemap.xml` and `robots.txt` file in the root
