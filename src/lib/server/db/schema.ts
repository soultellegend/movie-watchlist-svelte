import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
    id: text('id').primaryKey(),
 
    username: text('username').notNull().unique(),
    passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable("session", {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const watchlist = sqliteTable("watchlist", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  movieId: integer("movie_id").notNull(),
  title: text("title").notNull(),
  posterPath: text("poster_path"),
  voteAverage: integer("vote_average"),
  backdropPath: text("backdrop_path"),
  releaseDate: text("release_date"),
  overview: text("overview"),
  runtime: integer("runtime"),
  addedAt: text("added_at").notNull().default(new Date().toISOString()),
  status: text("status").notNull().default("planning"),
  startedAt: text("started_at"),
  completedAt: text("completed_at"),
  userId: text("user_id").notNull(),
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
