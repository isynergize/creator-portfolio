'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { Search } from './Search';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { PostCard } from '@/types/post';

const navLinks = [
  { href: '/posts', label: 'Posts' },
];

// ROYGBIV color sequence with subtle transparency for backdrop-blur effect
const roygbivColors = [
  'rgba(255, 59, 48, 0.15)',   // Red
  'rgba(255, 149, 0, 0.15)',   // Orange
  'rgba(255, 204, 0, 0.15)',   // Yellow
  'rgba(52, 199, 89, 0.15)',   // Green
  'rgba(0, 122, 255, 0.15)',   // Indigo/Blue
  'rgba(88, 86, 214, 0.15)',   // Blue/Indigo
  'rgba(175, 82, 222, 0.15)',  // Violet
  'rgba(255, 59, 48, 0.15)',   // Back to Red (seamless loop)
];

export function Header() {
  const pathname = usePathname();
  const [posts, setPosts] = useState<PostCard[]>([]);

  useEffect(() => {
    // Fetch posts for search on client side
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(() => setPosts([]));
  }, []);

  return (
    <motion.header
      animate={{ backgroundColor: roygbivColors }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: 'linear',
      }}
      className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
        <Link
          href="/"
          className="text-xl font-bold hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors shrink-0"
        >
          Your Name
        </Link>

        <div className="flex-1 hidden sm:block">
          <Search posts={posts} expanded />
        </div>

        <nav className="flex items-center gap-4 sm:gap-6">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hidden sm:block ${
                  isActive
                    ? 'text-neutral-900 dark:text-white'
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="sm:hidden">
            <Search posts={posts} />
          </div>
          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
            aria-label="RSS Feed"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.18 15.64a2.18 2.18 0 1 1 0 4.36 2.18 2.18 0 0 1 0-4.36m12.03 4.36a14.2 14.2 0 0 0-14.2-14.2V3.62A16.39 16.39 0 0 1 20.4 20h-2.2M15.1 20a9.09 9.09 0 0 0-9.1-9.1V8.71A11.29 11.29 0 0 1 17.29 20h-2.2" />
            </svg>
          </a>
          <ThemeToggle />
        </nav>
      </div>

      {/* Mobile navigation */}
      <div className="sm:hidden border-t border-neutral-200 dark:border-neutral-800">
        <nav className="max-w-3xl mx-auto px-4 py-2 flex justify-around">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-neutral-900 dark:text-white'
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}
