---
title: "Building Interactive Card Stacks with Motion"
date: "2026-01-24"
description: "A deep dive into creating swipeable card stack animations using Motion for React."
tags: ["react", "animation", "motion", "modal-product-1"]
featured: false
draft: false
images:
  - "https://picsum.photos/seed/card121/400/500"
  - "https://picsum.photos/seed/card20/400/500"
  - "https://picsum.photos/seed/card30/400/500"
  - "https://picsum.photos/seed/card4/400/500"
---

Card stack interfaces are a popular pattern for displaying content in an engaging, interactive way. In this post, I'll walk through how to build one using Motion for React.

## The Concept

A card stack allows users to:

1. **Swipe cards** left or right to navigate
2. **See depth** through stacked card positioning
3. **Use keyboard** for accessibility

## Key Features

The implementation uses several Motion features:

- `useMotionValue` for tracking drag position
- `useTransform` for deriving rotation and opacity from position
- `animate` for programmatic animations
- Drag gestures with `drag`, `dragConstraints`, and `onDragEnd`

## The Stack Effect

Cards are positioned with decreasing scale and increasing Y offset:

```typescript
const style = {
  zIndex: cards.length - index,
  scale: 1 - index * 0.05,
  y: index * 8,
  opacity: 1 - index * 0.15,
};
```

This creates the visual depth effect where cards appear stacked behind each other.

## Try It Out

Swipe through the images above to see the card stack in action! You can also use the arrow keys to navigate.
