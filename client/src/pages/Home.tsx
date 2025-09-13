import { useState, useMemo } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import Filters from "@/components/Filters";
import PromptCard from "@/components/PromptCard";
import PromptModal from "@/components/PromptModal";
import EmptyState from "@/components/EmptyState";
import ThemeToggle from "@/components/ThemeToggle";

// Mock data - todo: remove mock functionality
const MOCK_PROMPTS = [
  {
    id: "1",
    title: "Анализ заинтересованных сторон",
    slug: "stakeholder-analysis",
    summary: "Системный подход к выявлению и анализу всех заинтересованных сторон проекта для эффективного управления ожиданиями",
    fullText: `Проведите анализ заинтересованных сторон проекта:

1. Идентификация стейкхолдеров:
   - Внутренние (команда, руководство, отделы)
   - Внешние (клиенты, поставщики, регуляторы)
   - Ключевые (высокое влияние/интерес)
   - Второстепенные (низкое влияние/интерес)

2. Анализ по матрице влияние/интерес:
   - Высокое влияние, высокий интерес: управлять тесно
   - Высокое влияние, низкий интерес: держать довольными
   - Низкое влияние, высокий интерес: держать в курсе
   - Низкое влияние, низкий интерес: мониторить

3. Определите для каждого стейкхолдера:
   - Ожидания от проекта
   - Потенциальные риски
   - Стратегию взаимодействия
   - Частоту коммуникаций`,
    stage: "initiation",
    tags: ["анализ", "стейкхолдеры", "планирование"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2", 
    title: "Декомпозиция работ (WBS)",
    slug: "work-breakdown-structure",
    summary: "Структурированный подход к разбиению проекта на управляемые компоненты и задачи",
    fullText: `Создайте структуру декомпозиции работ (WBS):

1. Определите основные результаты проекта:
   - Ключевые поставки (deliverables)
   - Промежуточные результаты
   - Критерии приемки

2. Декомпозируйте каждый результат:
   - Разбейте на подзадачи
   - Определите зависимости
   - Установите иерархию

3. Для каждого элемента WBS определите:
   - Объем работ
   - Ресурсы
   - Временные рамки
   - Ответственных

4. Создайте WBS-словарь:
   - Описание каждого элемента
   - Критерии завершения
   - Связанные риски`,
    stage: "planning",
    tags: ["планирование", "декомпозиция", "структура"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    title: "Оценка рисков проекта",
    slug: "risk-assessment",
    summary: "Матрица вероятности и влияния для систематической оценки проектных рисков",
    fullText: `Проведите оценку рисков проекта:

1. Идентификация рисков:
   - Технические риски
   - Ресурсные риски
   - Временные риски
   - Внешние риски

2. Анализ по матрице вероятность/влияние:
   - Высокая вероятность, высокое влияние: критические
   - Высокая вероятность, низкое влияние: мониторить
   - Низкая вероятность, высокое влияние: планировать
   - Низкая вероятность, низкое влияние: принять

3. Разработайте стратегии реагирования:
   - Избежание
   - Снижение
   - Передача
   - Принятие

4. Создайте план управления рисками:
   - Владельцы рисков
   - Триггеры
   - Планы действий`,
    stage: "planning",
    tags: ["риски", "анализ", "матрица"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    title: "План коммуникаций",
    slug: "communication-plan",
    summary: "Структурированный подход к планированию коммуникаций с заинтересованными сторонами",
    fullText: `Разработайте план коммуникаций проекта:

1. Определите потребности в коммуникациях:
   - Кто нуждается в информации
   - Какая информация нужна
   - Когда нужна информация
   - В каком формате

2. Выберите каналы коммуникации:
   - Официальные отчеты
   - Встречи и презентации
   - Email-рассылки
   - Корпоративные платформы

3. Установите график коммуникаций:
   - Еженедельные статусы
   - Ежемесячные отчеты
   - Критические уведомления
   - Итоговые презентации

4. Определите ответственности:
   - Кто готовит информацию
   - Кто утверждает
   - Кто распространяет`,
    stage: "execution",
    tags: ["коммуникации", "планирование", "отчетность"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "5",
    title: "Мониторинг прогресса проекта",
    slug: "progress-monitoring",
    summary: "Система отслеживания ключевых показателей эффективности проекта",
    fullText: `Организуйте мониторинг прогресса проекта:

1. Определите KPI проекта:
   - Временные показатели (соблюдение сроков)
   - Бюджетные показатели (CPI, AC, EV)
   - Качественные показатели
   - Показатели удовлетворенности

2. Настройте систему отчетности:
   - Dashboard с ключевыми метриками
   - Еженедельные статус-отчеты
   - Анализ трендов
   - Прогнозирование

3. Проводите регулярный анализ:
   - Отклонения от плана
   - Причины задержек
   - Эффективность ресурсов
   - Качество результатов

4. Принимайте корректирующие действия:
   - Перепланирование задач
   - Перераспределение ресурсов
   - Изменение процессов`,
    stage: "monitoring",
    tags: ["мониторинг", "KPI", "отчетность"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "6",
    title: "Ретроспектива проекта",
    slug: "project-retrospective",
    summary: "Структурированный анализ проекта для извлечения уроков и улучшения процессов",
    fullText: `Проведите ретроспективу проекта:

1. Подготовьте данные для анализа:
   - Финальные метрики проекта
   - Обратную связь стейкхолдеров
   - Документацию процессов
   - Зафиксированные проблемы

2. Проанализируйте что прошло хорошо:
   - Успешные практики
   - Эффективные решения
   - Удачные коммуникации
   - Позитивные моменты

3. Определите области для улучшения:
   - Проблемные процессы
   - Неэффективные решения
   - Коммуникационные сбои
   - Ресурсные ограничения

4. Создайте план действий:
   - Документируйте уроки
   - Обновите процессы
   - Поделитесь знаниями
   - Внедрите улучшения`,
    stage: "closing",
    tags: ["ретроспектива", "анализ", "улучшения"],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<typeof MOCK_PROMPTS[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get all unique tags from prompts
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    MOCK_PROMPTS.forEach(prompt => {
      prompt.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, []);

  // Filter prompts based on search and filters
  const filteredPrompts = useMemo(() => {
    return MOCK_PROMPTS.filter(prompt => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          prompt.title.toLowerCase().includes(query) ||
          prompt.summary.toLowerCase().includes(query) ||
          prompt.fullText.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Stage filter
      if (selectedStage !== "all" && prompt.stage !== selectedStage) {
        return false;
      }

      // Tags filter
      if (selectedTags.length > 0) {
        const hasSelectedTag = selectedTags.some(tag => prompt.tags.includes(tag));
        if (!hasSelectedTag) return false;
      }

      return true;
    });
  }, [searchQuery, selectedStage, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedStage("all");
    setSelectedTags([]);
  };

  const handleExpandPrompt = (prompt: typeof MOCK_PROMPTS[0]) => {
    setSelectedPrompt(prompt);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSuggestPrompt={() => console.log('Suggest prompt clicked')} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <SearchBar 
                onSearch={setSearchQuery}
                placeholder="Поиск промптов по названию, описанию или содержимому..."
              />
            </div>
            <ThemeToggle />
          </div>
          
          <Filters
            selectedStage={selectedStage}
            selectedTags={selectedTags}
            availableTags={availableTags}
            onStageChange={setSelectedStage}
            onTagToggle={handleTagToggle}
            onClearFilters={handleClearFilters}
          />
        </div>

        {filteredPrompts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                id={prompt.id}
                title={prompt.title}
                summary={prompt.summary}
                stage={prompt.stage}
                tags={prompt.tags}
                fullText={prompt.fullText}
                onExpand={() => handleExpandPrompt(prompt)}
              />
            ))}
          </div>
        )}
      </main>

      <PromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prompt={selectedPrompt}
      />
    </div>
  );
}