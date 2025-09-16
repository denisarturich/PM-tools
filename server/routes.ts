import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import prisma from "./prisma";
import { getStageOrder, sortPromptsByStage } from "./stageSort";

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
      
      // Stage filter
      if (stage && typeof stage === "string" && stage !== "all") {
        where.stage = stage;
      }

      // Получаем промпты без сортировки по времени (будем сортировать сами)
      const [promptsData, total] = await Promise.all([
        prisma.prompt.findMany({
          where,
          skip,
          take,
          // Убираем orderBy - будем сортировать по этапам
        }),
        prisma.prompt.count({ where }),
      ]);

      // Получаем настроенный порядок этапов
      const stageWeights = await getStageOrder();
      
      // Сортируем промпты по этапам, затем по дате создания
      const prompts = sortPromptsByStage(promptsData, stageWeights);

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

  // GET /api/prompts/:slug - получение одного промпта по slug
  app.get("/api/prompts/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      
      const prompt = await prisma.prompt.findUnique({
        where: { slug },
      });

      if (!prompt) {
        return res.status(404).json({ error: "Prompt not found" });
      }

      res.json(prompt);
    } catch (error) {
      console.error("Error fetching prompt:", error);
      res.status(500).json({ error: "Failed to fetch prompt" });
    }
  });

  // Admin routes (basic auth would be needed in production)
  
  // POST /api/admin/prompts - создание нового промпта
  app.post("/api/admin/prompts", async (req, res) => {
    try {
      const { title, summary, stage, fullText } = req.body;

      if (!title || !summary || !stage || !fullText) {
        return res.status(400).json({ 
          error: "Missing required fields: title, summary, stage, fullText" 
        });
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
          stage,
          fullText,
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
      const { title, summary, stage, fullText } = req.body;

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

      const prompt = await prisma.prompt.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(slug !== existingPrompt.slug && { slug }),
          ...(summary && { summary }),
          ...(stage && { stage }),
          ...(fullText && { fullText }),
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
