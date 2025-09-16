import prisma from "./prisma";
import { ProjectStage, DEFAULT_STAGE_WEIGHTS, type Prompt, type StageWeight } from "@shared/schema";

/**
 * Получает настроенный порядок этапов с учетом переопределений из БД
 * @param organizationId ID организации (null для глобальных настроек)
 * @returns Map с весами для каждого этапа
 */
export async function getStageOrder(organizationId: string | null = null): Promise<Map<string, number>> {
  // Получаем переопределения из БД
  const overrides = await (prisma as any).stageOrderOverride.findMany({
    where: {
      organizationId: organizationId,
    },
  });

  // Создаем мапу с дефолтными весами
  const stageWeights = new Map<string, number>();
  
  // Заполняем дефолтными значениями
  Object.entries(DEFAULT_STAGE_WEIGHTS).forEach(([stage, weight]) => {
    stageWeights.set(stage, weight);
  });

  // Применяем переопределения из БД
  overrides.forEach((override: any) => {
    stageWeights.set(override.stage, override.weight);
  });

  return stageWeights;
}

/**
 * Получает вес этапа для сортировки
 * @param stage Этап проекта
 * @param stageWeights Мапа с весами этапов
 * @returns Вес этапа (999 для неизвестных этапов - они идут в конец)
 */
export function getStageWeight(stage: string, stageWeights: Map<string, number>): number {
  return stageWeights.get(stage) ?? 999; // Неизвестные этапы идут в конец
}

/**
 * Сортирует промпты по этапам проекта, затем по вторичному критерию
 * @param prompts Список промптов для сортировки
 * @param stageWeights Мапа с весами этапов
 * @param secondarySort Функция вторичной сортировки (по умолчанию по createdAt DESC)
 * @returns Отсортированный список промптов
 */
export function sortPromptsByStage(
  prompts: any[],
  stageWeights: Map<string, number>,
  secondarySort: (a: any, b: any) => number = (a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
): any[] {
  return prompts.sort((a, b) => {
    // Сначала сортируем по этапам
    const stageWeightA = getStageWeight(a.stage, stageWeights);
    const stageWeightB = getStageWeight(b.stage, stageWeights);
    
    if (stageWeightA !== stageWeightB) {
      return stageWeightA - stageWeightB;
    }
    
    // Если этапы одинаковые, используем вторичную сортировку
    return secondarySort(a, b);
  });
}

/**
 * Создает или обновляет переопределение порядка этапа
 * @param organizationId ID организации (null для глобальных настроек)
 * @param stage Этап проекта
 * @param weight Новый вес этапа
 */
export async function setStageOrderOverride(
  organizationId: string | null,
  stage: ProjectStage,
  weight: number
): Promise<void> {
  await (prisma as any).stageOrderOverride.upsert({
    where: {
      organizationId_stage: {
        organizationId: organizationId,
        stage: stage,
      },
    },
    update: {
      weight: weight,
    },
    create: {
      organizationId: organizationId,
      stage: stage,
      weight: weight,
    },
  });
}

/**
 * Получает все переопределения порядка этапов для организации
 * @param organizationId ID организации (null для глобальных настроек)
 * @returns Список переопределений
 */
export async function getStageOrderOverrides(organizationId: string | null = null) {
  return await (prisma as any).stageOrderOverride.findMany({
    where: {
      organizationId: organizationId,
    },
    orderBy: {
      weight: 'asc',
    },
  });
}

/**
 * Удаляет переопределение порядка этапа
 * @param organizationId ID организации
 * @param stage Этап проекта
 */
export async function removeStageOrderOverride(
  organizationId: string | null,
  stage: ProjectStage
): Promise<void> {
  await (prisma as any).stageOrderOverride.deleteMany({
    where: {
      organizationId: organizationId,
      stage: stage,
    },
  });
}