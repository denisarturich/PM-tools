import { PrismaClient } from "@prisma/client";
import slugify from "slugify";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const prisma = new PrismaClient();

function makeSlug(title: string): string {
  return slugify(title, { 
    lower: true, 
    strict: true, 
    locale: "ru",
    replacement: "-"
  }).slice(0, 200);
}

async function main() {
  console.log("🌱 Starting database seeding...");
  
  // Read the JSON file (ESM compatible)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const dataPath = path.join(__dirname, "seeds", "prompts.json");
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const data = JSON.parse(rawData);

  console.log(`📊 Found ${data.length} prompts to seed`);

  for (const p of data) {
    const baseSlug = p.slug || makeSlug(p.title);
    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await prisma.prompt.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    await prisma.prompt.upsert({
      where: { slug },
      update: {
        title: p.title,
        summary: p.summary,
        stage: p.stage,
        fullText: p.fullText,
      },
      create: {
        title: p.title,
        slug,
        summary: p.summary,
        stage: p.stage,
        fullText: p.fullText,
      },
    });

    console.log(`✅ Seeded: ${p.title} (${slug})`);
  }

  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });