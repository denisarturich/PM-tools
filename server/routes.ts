import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import prisma from "./prisma";
import { getStageOrder, sortPromptsByStage } from "./stageSort";
import type { Prisma } from "@prisma/client";

export async function registerRoutes(app: Express): Promise<Server> {
  // Prompts API routes
  
  // GET /api/prompts - список всех промптов с фильтрацией
  app.get("/api/prompts", async (req, res) => {
    try {
      const { q, stage, page = "1", pageSize = "50" } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);
      const take = parseInt(pageSize as string);

      // Build filter conditions
      const where: any = {};
      
      // Text search
      if (q && typeof q === "string") {
        where.OR = [
          { title: { contains: q, mode: "insensitive" } },
          { summary: { contains: q, mode: "insensitive" } },
          { fullText: { contains: q, mode: "insensitive" } },
        ];
      }
      
      // Stage filter - now using stageId
      if (stage && typeof stage === "string" && stage !== "all") {
        // Find the stage by name to get its ID
        const stageRecord = await prisma.stage.findFirst({
          where: { name: stage },
          select: { id: true }
        });
        if (stageRecord) {
          where.stageId = stageRecord.id;
        }
      }

      // Получаем промпты с данными о стадиях через JOIN
      const [promptsData, total] = await Promise.all([
        prisma.prompt.findMany({
          where,
          skip,
          take,
          include: {
            stageRef: true, // Включаем связанную стадию
          },
          orderBy: [
            { createdAt: 'asc' }
          ]
        }),
        prisma.prompt.count({ where }),
      ]);

      // Преобразуем данные для фронтенда (переименовываем stageRef в stageDetails)
      const prompts = promptsData.map(prompt => {
        const { stageRef, ...rest } = prompt;
        return {
          ...rest,
          stageDetails: stageRef || null
        };
      });

      res.json({
        prompts,
        pagination: {
          page: parseInt(page as string),
          pageSize: parseInt(pageSize as string),
          total,
          totalPages: Math.ceil(total / parseInt(pageSize as string)),
        },
      });
    } catch (error) {
      console.error("Error fetching prompts:", error);
      res.status(500).json({ error: "Failed to fetch prompts" });
    }
  });

  // GET /api/stages - получение списка стадий из новой таблицы stages
  app.get("/api/stages", async (req, res) => {
    try {
      // Получаем все стадии из новой таблицы stages
      const stagesData = await prisma.$queryRaw`
        SELECT id, name, priority, color FROM stages ORDER BY priority ASC
      ` as Array<{id: string, name: string, priority: number, color: string}>;

      // Преобразуем в нужный формат для фильтра
      const stages = [
        { value: "all", label: "All stages" },
        ...stagesData.map(stage => ({
          value: stage.id,
          label: stage.name,
          color: stage.color,
          priority: stage.priority
        }))
      ];

      res.json({ stages });
    } catch (error) {
      console.error("Error fetching stages:", error);
      res.status(500).json({ error: "Failed to fetch stages" });
    }
  });

  // GET /api/prompts/:slug - получение одного промпта по slug
  app.get("/api/prompts/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      
      const prompt = await prisma.prompt.findUnique({
        where: { slug },
        include: {
          stageRef: true, // Include stage details for consistency
        },
      });

      if (!prompt) {
        return res.status(404).json({ error: "Prompt not found" });
      }

      // Transform data for frontend (rename stageRef to stageDetails)
      const { stageRef, ...rest } = prompt;
      const responseData = {
        ...rest,
        stageDetails: stageRef || null
      };

      res.json(responseData);
    } catch (error) {
      console.error("Error fetching prompt:", error);
      res.status(500).json({ error: "Failed to fetch prompt" });
    }
  });

  // Admin routes (basic auth would be needed in production)
  
  // POST /api/admin/prompts - создание нового промпта
  app.post("/api/admin/prompts", async (req, res) => {
    try {
      const { title, summary, stage, fullText, authorName, authorUrl } = req.body;

      if (!title || !summary || !stage || !fullText) {
        return res.status(400).json({ 
          error: "Missing required fields: title, summary, stage, fullText" 
        });
      }

      // Find stage by name to get stageId
      const stageRecord = await prisma.stage.findFirst({
        where: { name: stage },
        select: { id: true }
      });
      
      if (!stageRecord) {
        return res.status(400).json({ error: `Stage '${stage}' not found` });
      }

      // Generate slug from title
      const slugify = (await import("slugify")).default;
      let baseSlug = slugify(title, { 
        lower: true, 
        strict: true, 
        locale: "ru",
        replacement: "-"
      }).slice(0, 200);
      
      let slug = baseSlug;
      let counter = 1;
      
      // Ensure unique slug
      while (await prisma.prompt.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const prompt = await prisma.prompt.create({
        data: {
          title,
          slug,
          summary,
          stage, // Keep for backward compatibility
          stageId: stageRecord.id, // New stageId reference
          fullText,
          ...(authorName && { authorName }),
          ...(authorUrl && { authorUrl }),
        },
      });

      res.status(201).json(prompt);
    } catch (error) {
      console.error("Error creating prompt:", error);
      res.status(500).json({ error: "Failed to create prompt" });
    }
  });

  // PUT /api/admin/prompts/:id - обновление промпта
  app.put("/api/admin/prompts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { title, summary, stage, fullText, authorName, authorUrl } = req.body;

      const existingPrompt = await prisma.prompt.findUnique({
        where: { id },
      });

      if (!existingPrompt) {
        return res.status(404).json({ error: "Prompt not found" });
      }

      // Update slug if title changed
      let slug = existingPrompt.slug;
      if (title && title !== existingPrompt.title) {
        const slugify = (await import("slugify")).default;
        let baseSlug = slugify(title, { 
          lower: true, 
          strict: true, 
          locale: "ru",
          replacement: "-"
        }).slice(0, 200);
        
        let newSlug = baseSlug;
        let counter = 1;
        
        // Ensure unique slug (exclude current prompt)
        while (await prisma.prompt.findFirst({ 
          where: { slug: newSlug, id: { not: id } } 
        })) {
          newSlug = `${baseSlug}-${counter}`;
          counter++;
        }
        slug = newSlug;
      }

      // Find stage by name to get stageId if stage is being updated
      let stageId = undefined;
      if (stage) {
        const stageRecord = await prisma.stage.findFirst({
          where: { name: stage },
          select: { id: true }
        });
        
        if (!stageRecord) {
          return res.status(400).json({ error: `Stage '${stage}' not found` });
        }
        stageId = stageRecord.id;
      }

      const prompt = await prisma.prompt.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(slug !== existingPrompt.slug && { slug }),
          ...(summary && { summary }),
          ...(stage && { stage }), // Keep for backward compatibility
          ...(stageId && { stageId }), // Update stageId reference
          ...(fullText && { fullText }),
          ...(authorName !== undefined && { authorName }),
          ...(authorUrl !== undefined && { authorUrl }),
        },
      });

      res.json(prompt);
    } catch (error) {
      console.error("Error updating prompt:", error);
      res.status(500).json({ error: "Failed to update prompt" });
    }
  });

  // DELETE /api/admin/prompts/:id - удаление промпта
  app.delete("/api/admin/prompts/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const existingPrompt = await prisma.prompt.findUnique({
        where: { id },
      });

      if (!existingPrompt) {
        return res.status(404).json({ error: "Prompt not found" });
      }

      await prisma.prompt.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting prompt:", error);
      res.status(500).json({ error: "Failed to delete prompt" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
