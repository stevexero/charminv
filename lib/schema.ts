import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerk_id: text('clerk_id').unique().notNull(),
  contact_info: text('contact_info').unique().notNull(),
  role: text('role').default('user').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  image_url: text('image_url')
    .notNull()
    .default(
      'https://images.pexels.com/photos/28216688/pexels-photo-28216688/free-photo-of-autumn-camping.png'
    ),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const subcategories = pgTable('subcategories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  category_id: uuid('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),

  in_today: integer('in_today').default(0).notNull(),
  out_today: integer('out_today').default(0).notNull(),
  in_week: integer('in_week').default(0).notNull(),
  out_week: integer('out_week').default(0).notNull(),

  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const items = pgTable('items', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  subcategory_id: uuid('subcategory_id')
    .notNull()
    .references(() => subcategories.id, { onDelete: 'cascade' }),
  in_day: integer('in_day').default(0).notNull(),
  out_day: integer('out_day').default(0).notNull(),
  in_week: integer('in_week').default(0).notNull(),
  out_week: integer('out_week').default(0).notNull(),
  week_start: integer('week_start').default(0).notNull(),
  week_end: integer('week_end').default(0).notNull(),
  week_total_out: integer('week_total_out').default(0).notNull(),
  monday_in: integer('monday_in').default(0).notNull(),
  monday_out: integer('monday_out').default(0).notNull(),
  tuesday_in: integer('tuesday_in').default(0).notNull(),
  tuesday_out: integer('tuesday_out').default(0).notNull(),
  wednesday_in: integer('wednesday_in').default(0).notNull(),
  wednesday_out: integer('wednesday_out').default(0).notNull(),
  thursday_in: integer('thursday_in').default(0).notNull(),
  thursday_out: integer('thursday_out').default(0).notNull(),
  friday_in: integer('friday_in').default(0).notNull(),
  friday_out: integer('friday_out').default(0).notNull(),
  saturday_in: integer('saturday_in').default(0).notNull(),
  saturday_out: integer('saturday_out').default(0).notNull(),
  sunday_in: integer('sunday_in').default(0).notNull(),
  sunday_out: integer('sunday_out').default(0).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const weekDaysEnum = pgEnum('week_days', [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]);

export const settings = pgTable('settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  week_start: weekDaysEnum('week_start').default('sunday').notNull(),
});
