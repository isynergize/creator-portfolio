'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { PostCard } from '@/types/post';

interface SearchProps {
  posts: PostCard[];
  expanded?: boolean;
}

export function Search({ posts, expanded = false }: SearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<PostCard[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = posts.filter((post) => {
      const searchableText = [post.title, post.description, ...post.tags]
        .join(' ')
        .toLowerCase();
      return searchableText.includes(lowercaseQuery);
    });

    setResults(filtered.slice(0, 5));
    setSelectedIndex(0);
  }, [query, posts]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      window.location.href = `/posts/${results[selectedIndex].slug}`;
      handleClose();
    }
  };

  return (
    <div ref={containerRef} className={`relative ${expanded ? 'w-full' : ''}`}>
      {/* Search trigger / input */}
      {expanded ? (
        <div
          className={`flex items-center gap-3 px-4 py-2 text-sm bg-neutral-100 dark:bg-neutral-800 rounded-lg transition-colors ${
            isOpen
              ? 'ring-2 ring-neutral-400 dark:ring-neutral-600'
              : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }`}
        >
          <svg className="w-4 h-4 shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search posts..."
            className="flex-1 bg-transparent outline-none text-neutral-900 dark:text-white placeholder-neutral-400"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs text-neutral-400 bg-neutral-200 dark:bg-neutral-700 rounded">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      ) : (
        <button
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          className="flex items-center gap-2 p-2 text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      )}

      {/* Dropdown results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden z-50">
          {results.length > 0 ? (
            <ul className="py-2 max-h-80 overflow-y-auto">
              {results.map((post, index) => (
                <li key={post.slug}>
                  <Link
                    href={`/posts/${post.slug}`}
                    onClick={handleClose}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                      index === selectedIndex
                        ? 'bg-neutral-100 dark:bg-neutral-800'
                        : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-neutral-900 dark:text-white">
                          {post.title}
                        </span>
                        {post.type === 'recipe' && (
                          <span className="px-1.5 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">
                            Recipe
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1">
                        {post.description}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : query ? (
            <div className="px-4 py-6 text-center text-neutral-500 dark:text-neutral-400">
              No results for &quot;{query}&quot;
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-neutral-400 dark:text-neutral-500 text-sm">
              Start typing to search...
            </div>
          )}

          {/* Footer hint */}
          <div className="px-4 py-2 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-400 flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">↵</kbd>
              select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">esc</kbd>
              close
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
