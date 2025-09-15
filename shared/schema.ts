import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Prompt types (matching Prisma model)
export const promptSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  stage: z.string(),
  fullText: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertPromptSchema = promptSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePromptSchema = insertPromptSchema.partial();

export type Prompt = z.infer<typeof promptSchema>;
export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type UpdatePrompt = z.infer<typeof updatePromptSchema>;

// API Response types
export type PromptsResponse = {
  prompts: Prompt[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};
