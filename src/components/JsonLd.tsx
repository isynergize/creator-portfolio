// Site configuration - update these values
export const siteConfig = {
  name: 'Your Name',
  title: 'Your Name - Portfolio',
  description: 'Developer, designer, and creator. Building things for the web.',
  url: 'https://yourname.com',
  image: '/og-image.jpg',
  twitter: '@yourhandle',
  github: 'yourgithub',
};

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any> | Record<string, any>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Schema generators
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    author: {
      '@type': 'Person',
      name: siteConfig.name,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/posts?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    url: siteConfig.url,
    image: `${siteConfig.url}${siteConfig.image}`,
    sameAs: [
      `https://twitter.com/${siteConfig.twitter.replace('@', '')}`,
      `https://github.com/${siteConfig.github}`,
    ],
    jobTitle: 'Developer',
    knowsAbout: ['Web Development', 'Next.js', 'React', 'TypeScript'],
  };
}

export function generateBlogSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${siteConfig.name}'s Blog`,
    description: 'Thoughts on development, design, and more.',
    url: `${siteConfig.url}/posts`,
    author: {
      '@type': 'Person',
      name: siteConfig.name,
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.name,
    },
  };
}

interface ArticleSchemaProps {
  title: string;
  description: string;
  slug: string;
  date: string;
  tags?: string[];
  image?: string;
}

export function generateArticleSchema({
  title,
  description,
  slug,
  date,
  tags = [],
  image,
}: ArticleSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: `${siteConfig.url}/posts/${slug}`,
    datePublished: date,
    dateModified: date,
    author: {
      '@type': 'Person',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.name,
    },
    image: image ? `${siteConfig.url}${image}` : `${siteConfig.url}${siteConfig.image}`,
    keywords: tags.join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/posts/${slug}`,
    },
  };
}

interface ProjectSchemaProps {
  title: string;
  description: string;
  slug: string;
  date: string;
  image?: string;
}

export function generateProjectSchema({
  title,
  description,
  slug,
  date,
  image,
}: ProjectSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description: description,
    url: `${siteConfig.url}/posts/${slug}`,
    dateCreated: date,
    author: {
      '@type': 'Person',
      name: siteConfig.name,
    },
    image: image ? `${siteConfig.url}${image}` : undefined,
  };
}

interface BookReviewSchemaProps {
  title: string;
  description: string;
  slug: string;
  date: string;
  bookTitle: string;
}

export function generateBookReviewSchema({
  title,
  description,
  slug,
  date,
  bookTitle,
}: BookReviewSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: title,
    description: description,
    url: `${siteConfig.url}/posts/${slug}`,
    datePublished: date,
    author: {
      '@type': 'Person',
      name: siteConfig.name,
    },
    itemReviewed: {
      '@type': 'Book',
      name: bookTitle,
    },
  };
}
