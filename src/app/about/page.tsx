import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about me and what I do.',
};

export default function AboutPage() {
  return (
    <div className="prose dark:prose-invert">
      <h1>About Me</h1>

      <p>
        Welcome to my corner of the internet. I&apos;m a developer passionate
        about building things that live on the web.
      </p>

      <h2>What I Do</h2>

      <p>
        I specialize in building modern web applications using technologies
        like React, Next.js, TypeScript, and Node.js. I enjoy creating clean,
        performant, and accessible user experiences.
      </p>

      <h2>This Site</h2>

      <p>
        This portfolio is built with Next.js, styled with Tailwind CSS, and
        deployed on Vercel. Posts are written in Markdown and rendered
        dynamically. When a post includes images, they&apos;re displayed as an
        interactive card stack that you can swipe through.
      </p>

      <h2>Get in Touch</h2>

      <p>
        Feel free to reach out via email or connect with me on social media.
        I&apos;m always happy to chat about web development, potential
        collaborations, or just to say hello.
      </p>

      <ul>
        <li>
          <a href="mailto:your@email.com">Email</a>
        </li>
        <li>
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </li>
        <li>
          <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        </li>
      </ul>
    </div>
  );
}
