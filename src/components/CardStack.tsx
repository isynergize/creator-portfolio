'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
  type MotionValue,
} from 'motion/react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import type { ImageOrientation } from '@/types/post';

interface CardImage {
  src: string;
  alt: string;
  orientation: ImageOrientation;
}

interface CardProps {
  image: CardImage;
  index: number;
  style: {
    zIndex: number;
    scale: number;
    y: number;
    opacity: number;
  };
  onSwipe: (direction: 'left' | 'right') => void;
  active: boolean;
  xMotion: MotionValue<number>;
  total: number;
  backContent?: string;
  isFlipped: boolean;
  onFlip: () => void;
}

function Card({ image, index, style, onSwipe, active, xMotion, total, backContent, isFlipped, onFlip }: CardProps) {
  const rotate = useTransform(xMotion, [-200, 200], [-15, 15]);
  const dragOpacity = useTransform(
    xMotion,
    [-200, -100, 0, 100, 200],
    [0.7, 1, 1, 1, 0.7]
  );
  const isDragging = useRef(false);

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ): void => {
    const threshold = 100;
    if (
      Math.abs(info.offset.x) > threshold ||
      Math.abs(info.velocity.x) > 500
    ) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      const exitX = info.offset.x > 0 ? 300 : -300;
      animate(xMotion, exitX, {
        duration: 0.3,
        onComplete: () => {
          onSwipe(direction);
          xMotion.set(0);
        },
      });
    } else {
      animate(xMotion, 0, { type: 'spring', stiffness: 500, damping: 30 });
    }
    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  const handleClick = () => {
    if (!isDragging.current && active && backContent) {
      onFlip();
    }
  };

  const canFlip = active && backContent;

  return (
    <motion.div
      className="absolute w-full h-full select-none"
      style={{
        zIndex: style.zIndex,
        scale: style.scale,
        y: style.y,
        x: xMotion,
        rotate,
        opacity: active ? dragOpacity : style.opacity,
        perspective: 1000,
      }}
      drag={active && !isFlipped ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        onClick={handleClick}
      >
        {/* Front face - Image */}
        <div
          className={`absolute w-full h-full rounded-xl overflow-hidden shadow-xl bg-neutral-200 dark:bg-neutral-800 ${canFlip ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            priority={index === 0}
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/60 to-transparent">
            <div className="flex items-center justify-between">
              <p className="text-white text-sm font-medium">
                {index + 1} / {total}
              </p>
              {canFlip && (
                <span className="text-white/70 text-xs flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Tap to flip
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Back face - Content */}
        {backContent && (
          <div
            className="absolute w-full h-full rounded-xl overflow-hidden shadow-xl bg-white dark:bg-neutral-900 cursor-pointer"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="w-full h-full p-6 overflow-y-auto">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{backContent}</ReactMarkdown>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-white dark:from-neutral-900 to-transparent">
              <p className="text-neutral-500 dark:text-neutral-400 text-xs text-center">
                Tap to flip back
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

interface CardStackProps {
  images: { src: string; orientation?: ImageOrientation }[];
  alt?: string;
  cardContent?: (string | undefined)[];
}

export function CardStack({ images, alt = 'Image', cardContent = [] }: CardStackProps) {
  const cardImages: CardImage[] = images.map((img, i) => ({
    src: img.src,
    alt: `${alt} ${i + 1}`,
    orientation: img.orientation || 'portrait',
  }));

  // Determine container aspect ratio based on current top card
  const getAspectClass = (orientation: ImageOrientation) =>
    orientation === 'landscape' ? 'aspect-4/3' : 'aspect-3/4';

  const [cards, setCards] = useState<CardImage[]>(cardImages);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const xMotion = useMotionValue(0);
  const staticXMotion = useMotionValue(0);
  const isAnimating = useRef(false);

  const handleFlip = useCallback((src: string) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(src)) {
        next.delete(src);
      } else {
        next.add(src);
      }
      return next;
    });
  }, []);

  const handleSwipe = useCallback(
    (_direction: 'left' | 'right'): void => {
      setCards((prev) => {
        const newCards = [...prev];
        const [removed] = newCards.splice(0, 1);
        newCards.push(removed);
        return newCards;
      });
      setCurrentIndex((prev) => (prev + 1) % cardImages.length);
      isAnimating.current = false;
    },
    [cardImages.length]
  );

  const triggerSwipe = useCallback(
    (direction: 'left' | 'right'): void => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      const exitX = direction === 'left' ? -300 : 300;
      animate(xMotion, exitX, {
        duration: 0.3,
        onComplete: () => {
          handleSwipe(direction);
          xMotion.set(0);
        },
      });
    },
    [handleSwipe, xMotion]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          triggerSwipe('left');
          break;
        case 'ArrowRight':
          event.preventDefault();
          triggerSwipe('right');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [triggerSwipe]);

  if (images.length === 0) return null;

  // Get the current top card's orientation
  const currentOrientation = cards[0]?.orientation || 'portrait';

  if (images.length === 1) {
    const singleOrientation = cardImages[0].orientation;
    return (
      <div className={`relative w-full max-w-md mx-auto ${getAspectClass(singleOrientation)} rounded-xl overflow-hidden`}>
        <Image
          src={images[0].src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>
    );
  }

  return (
    <div className="my-8">
      <motion.div
        className="relative w-full max-w-md mx-auto"
        animate={{
          aspectRatio: currentOrientation === 'landscape' ? 4 / 3 : 3 / 4,
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}>
        {cards.map((card, index) => {
          const isTop = index === 0;
          const stackIndex = Math.min(index, 4);
          const originalIndex = cardImages.findIndex((c) => c.src === card.src);

          return (
            <Card
              key={card.src}
              image={card}
              index={originalIndex}
              active={isTop}
              onSwipe={handleSwipe}
              xMotion={isTop ? xMotion : staticXMotion}
              total={cardImages.length}
              backContent={cardContent[originalIndex]}
              isFlipped={flippedCards.has(card.src)}
              onFlip={() => handleFlip(card.src)}
              style={{
                zIndex: cards.length - index,
                scale: 1 - stackIndex * 0.05,
                y: stackIndex * 8,
                opacity: index < 5 ? 1 - stackIndex * 0.15 : 0,
              }}
            />
          );
        })}
      </motion.div>
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => triggerSwipe('left')}
            className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Previous image"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {currentIndex + 1} / {cardImages.length}
          </span>
          <button
            onClick={() => triggerSwipe('right')}
            className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Next image"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          Drag or use arrow keys
        </p>
      </div>
    </div>
  );
}
