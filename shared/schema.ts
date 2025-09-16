import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Project Stage Enum with default ordering weights
export enum ProjectStage {
  INITIATION = "initiation",
  PLANNING = "planning", 
  EXECUTION = "execution",
  MONITORING = "monitoring",
  CLOSURE = "closure"
}

// Default stage order with weights (allows easy insertion of new stages)
export const DEFAULT_STAGE_WEIGHTS: Record<ProjectStage, number> = {
  [ProjectStage.INITIATION]: 10,
  [ProjectStage.PLANNING]: 20,
  [ProjectStage.EXECUTION]: 30,
  [ProjectStage.MONITORING]: 40,
  [ProjectStage.CLOSURE]: 50,
};

// Stage display names in Russian
export const STAGE_DISPLAY_NAMES: Record<ProjectStage, string> = {
  [ProjectStage.INITIATION]: "Инициация",
  [ProjectStage.PLANNING]: "Планирование",
  [ProjectStage.EXECUTION]: "Выполнение", 
  [ProjectStage.MONITORING]: "Мониторинг",
  [ProjectStage.CLOSURE]: "Закрытие",
};

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

// Stage order overrides types
export const stageOrderOverrideSchema = z.object({
  id: z.string(),
  organizationId: z.string().optional().nullable(), // null for global defaults
  stage: z.nativeEnum(ProjectStage),
  weight: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type StageOrderOverride = z.infer<typeof stageOrderOverrideSchema>;

// Helper type for stage ordering
export type StageWeight = {
  stage: ProjectStage;
  weight: number;
};

// Prompt types (matching Prisma model)
export const promptSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  stage: z.nativeEnum(ProjectStage),
  fullText: z.string(),
  authorName: z.string().optional().nullable(),
  authorUrl: z.string().optional().nullable(),
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
