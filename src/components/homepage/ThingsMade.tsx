'use client';

import { ShowcaseCard } from '@/components/ShowcaseCard';
import type { PostCard } from '@/types/post';

interface ThingsMadeProps {
  projects: PostCard[];
}

export function ThingsMade({ projects }: ThingsMadeProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-2xl">
        <p className="text-neutral-500 dark:text-neutral-400">
          No projects to showcase yet.
        </p>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
          Tag posts with <code className="px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-800 rounded text-xs">modal-product-1</code>
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide sm:overflow-visible sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3">
      {projects.slice(0, 3).map((project, index) => (
        <ShowcaseCard
          key={project.slug}
          post={project}
          variant="project"
          index={index}
        />
      ))}
    </div>
  );
}
