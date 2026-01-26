import fs from 'fs';
import path from 'path';

const cardstackDirectory = path.join(process.cwd(), 'src/content/cardstack');

/**
 * Get card back content for a specific post slug.
 * Returns an array of markdown strings indexed by image position.
 * Missing files return undefined for that index.
 */
export function getCardContent(slug: string): (string | undefined)[] {
  const slugDir = path.join(cardstackDirectory, slug);

  if (!fs.existsSync(slugDir)) {
    return [];
  }

  const files = fs.readdirSync(slugDir)
    .filter((file) => file.endsWith('.md'))
    .sort((a, b) => {
      const numA = parseInt(a.replace('.md', ''));
      const numB = parseInt(b.replace('.md', ''));
      return numA - numB;
    });

  if (files.length === 0) {
    return [];
  }

  // Find the highest index to create array of correct size
  const maxIndex = Math.max(...files.map((f) => parseInt(f.replace('.md', ''))));
  const content: (string | undefined)[] = new Array(maxIndex).fill(undefined);

  files.forEach((file) => {
    const index = parseInt(file.replace('.md', '')) - 1; // 1.md -> index 0
    const filePath = path.join(slugDir, file);
    content[index] = fs.readFileSync(filePath, 'utf8');
  });

  return content;
}

/**
 * Check if a post has any card content
 */
export function hasCardContent(slug: string): boolean {
  const slugDir = path.join(cardstackDirectory, slug);
  if (!fs.existsSync(slugDir)) {
    return false;
  }
  const files = fs.readdirSync(slugDir).filter((file) => file.endsWith('.md'));
  return files.length > 0;
}
