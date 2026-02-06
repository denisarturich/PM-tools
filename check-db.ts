import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Checking database contents...\n");
  
  const prompts = await prisma.prompt.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      title: true,
      stage: true,
      authorName: true,
      createdAt: true,
    }
  });
  
  console.log(`📊 Total prompts: ${prompts.length}\n`);
  
  prompts.forEach((p, i) => {
    console.log(`${i + 1}. "${p.title}"`);
    console.log(`   Stage: ${p.stage}`);
    console.log(`   Author: ${p.authorName || 'N/A'}`);
    console.log(`   Created: ${p.createdAt.toISOString()}`);
    console.log('');
  });
  
  const stages = await prisma.stage.findMany({
    orderBy: { priority: 'asc' }
  });
  
  console.log(`\n🎯 Stages: ${stages.length}`);
  stages.forEach(s => {
    console.log(`   - ${s.name} (priority: ${s.priority}, color: ${s.color})`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
