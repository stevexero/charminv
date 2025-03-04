import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerk_id: text('clerk_id').unique().notNull(),
  contact_info: text('contact_info').unique().notNull(),
  role: text('role').default('user').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  image_url: text('image_url')
    .notNull()
    .default(
      'https://images.pexels.com/photos/28216688/pexels-photo-28216688/free-photo-of-autumn-camping.png'
    ),
  created_at: timestamp('created_at').defaultNow(),
});
