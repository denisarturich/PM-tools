import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Stage types for new stages table
export const stageSchema = z.object({
  id: z.string(),
  name: z.string(),
  priority: z.number(),
  color: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertStageSchema = stageSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Stage = z.infer<typeof stageSchema>;
export type InsertStage = z.infer<typeof insertStageSchema>;

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

// Stage order overrides types (updated for new structure)
export const stageOrderOverrideSchema = z.object({
  id: z.string(),
  organizationId: z.string().optional().nullable(), // null for global defaults
  stage: z.string(), // stage name instead of enum
  weight: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type StageOrderOverride = z.infer<typeof stageOrderOverrideSchema>;

// Helper type for stage ordering
export type StageWeight = {
  stage: string; // stage name instead of enum
  weight: number;
};

// Prompt types (updated for new structure)
export const promptSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  stage: z.string(), // Old stage field - kept for compatibility
  stageId: z.string().optional().nullable(), // New stage relationship
  fullText: z.string(),
  authorName: z.string().optional().nullable(),
  authorUrl: z.string().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Enhanced prompt with stage details
export const promptWithStageSchema = promptSchema.extend({
  stageDetails: stageSchema.optional().nullable(),
});

export const insertPromptSchema = promptSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePromptSchema = insertPromptSchema.partial();

export type Prompt = z.infer<typeof promptSchema>;
export type PromptWithStage = z.infer<typeof promptWithStageSchema>;
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
