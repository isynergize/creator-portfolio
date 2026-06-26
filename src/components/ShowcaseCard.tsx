'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Modal } from './Modal';
import type { PostCard } from '@/types/post';

type CardVariant = 'project' | 'evergreen' | 'reading';

interface ShowcaseCardProps {
  post: PostCard;
  variant: CardVariant;
  image?: string;
  index?: number;
}

export function ShowcaseCard({ post, variant, image, index = 0 }: ShowcaseCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardImage = image || 'https://picsum.photos/seed/' + post.slug + '/300/400';

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="relative h-[min(60vh,320px)] aspect-[3/4] flex-shrink-0 group"
    >
      <div className="relative w-full h-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800 shadow-lg transition-shadow duration-300 group-hover:shadow-xl">
        {/* Image */}
        <Image
          src={cardImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 45vw, 240px"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

        {/* Expand icon (project) */}
        {variant === 'project' && (
          <div className="absolute top-3 right-3 p-2 rounded-full bg-white/10 backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-base font-semibold text-white line-clamp-2 leading-snug">
            {post.title}
          </h3>
          <p className="mt-1.5 text-sm text-white/60 line-clamp-1">
            {post.readingTime}
          </p>
        </div>
      </div>
    </motion.div>
  );

  // Project variant: opens modal
  if (variant === 'project') {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 rounded-2xl"
        >
          {cardContent}
        </button>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="overflow-hidden">
            <div className="relative aspect-video w-full bg-neutral-100 dark:bg-neutral-800">
              <Image
                src={cardImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="512px"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                {post.title}
              </h2>
              <p className="mt-3 text-neutral-600 dark:text-neutral-400">
                {post.description}
              </p>
              {post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.filter(t => !t.startsWith('modal-product-')).map((tag) => (
                    <span key={tag} className="px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <a
                href={`/posts/${post.slug}`}
                className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-medium hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
              >
                View Project
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </Modal>
      </>
    );
  }

  // Evergreen and reading variants: link to post
  return (
    <Link href={`/posts/${post.slug}`} className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900">
      {cardContent}
    </Link>
  );
}
