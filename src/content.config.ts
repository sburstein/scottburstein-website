import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Your own short notes on what you read, hear and see. One Markdown file each.
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    by: z.string().optional(),
    kind: z.enum(['reading', 'listening', 'watching']),
    date: z.coerce.date(),
    link: z.url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { notes };
