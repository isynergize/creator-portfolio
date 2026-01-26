import Link from 'next/link';
import {
  getProjectsForShowcase,
  getEvergreenReads,
  getCurrentlyReading,
} from '@/lib/posts';
import { ThingsMade } from '@/components/homepage/ThingsMade';
import { ThingsToRead } from '@/components/homepage/ThingsToRead';
import { CurrentlyReading } from '@/components/homepage/CurrentlyReading';
import {
  JsonLd,
  generateWebSiteSchema,
  generatePersonSchema,
} from '@/components/JsonLd';

export default function HomePage() {
  const showcaseProjects = getProjectsForShowcase();
  const evergreenReads = getEvergreenReads();
  const currentlyReading = getCurrentlyReading();

  return (
    <>
      <JsonLd data={generateWebSiteSchema()} />
      <JsonLd data={generatePersonSchema()} />

      <div className="space-y-20">
        {/* Hero Section */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Hello, I&apos;m{' '}
          <span className="font-playwrite text-neutral-500 dark:text-neutral-400">
            Your Name
          </span>
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl">
          A brief introduction about yourself. What you do, what you&apos;re
          passionate about, and what visitors can expect to find here.
        </p>
        <div className="flex gap-4 pt-2">
          <Link
            href="/posts"
            className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-medium hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
          >
            Read Posts
          </Link>
          <Link
            href="/about"
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            About Me
          </Link>
        </div>
      </section>

      {/* Things Made - Projects Showcase */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-playwrite">Things Made</h2>
          <Link
            href="/posts/category/projects"
            className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
          >
            View all projects →
          </Link>
        </div>
        <ThingsMade projects={showcaseProjects} />
      </section>

      {/* Things You Need To Read - Evergreen Content */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-playwrite">Things You Need To Read</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Enduring wisdom from my reading journey
            </p>
          </div>
          <Link
            href="/posts/category/reviews"
            className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
          >
            All reviews →
          </Link>
        </div>
        <ThingsToRead posts={evergreenReads} />
      </section>

      {/* What I'm Reading - Current Reading */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-playwrite">What I&apos;m Reading</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Currently on my nightstand
            </p>
          </div>
        </div>
        <CurrentlyReading posts={currentlyReading} />
      </section>
      </div>
    </>
  );
}
