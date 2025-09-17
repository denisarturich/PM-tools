--
-- ПОЛНЫЙ ДАМП БАЗЫ ДАННЫХ PROJECT MANAGER PROMPTS
-- Создан: 2025-09-17
-- PostgreSQL версия: 16.9
-- 
-- Включает:
-- - 5 стадий проекта с цветами и приоритетами
-- - 7 промптов управления проектами 
-- - Все ограничения и внешние ключи
-- - Prisma миграции
--

-- Настройки подключения
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';
SET default_table_access_method = heap;

--
-- Таблица _prisma_migrations
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);

--
-- Таблица prompts (промпты для управления проектами)
--

CREATE TABLE public.prompts (
    id text NOT NULL,
    title character varying(200) NOT NULL,
    slug character varying(200) NOT NULL,
    summary character varying(500) NOT NULL,
    stage character varying(100) NOT NULL,
    "fullText" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "authorName" character varying(200),
    "authorUrl" character varying(500),
    "stageId" character varying(100)
);

--
-- Таблица stage_order_overrides (переопределения порядка стадий)
--

CREATE TABLE public.stage_order_overrides (
    id text NOT NULL,
    "organizationId" character varying(100),
    stage character varying(100) NOT NULL,
    weight integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);

--
-- Таблица stages (стадии проекта)
--

CREATE TABLE public.stages (
    id character varying(100) NOT NULL,
    name character varying(100) NOT NULL,
    priority integer NOT NULL,
    color character varying(50) DEFAULT 'gray'::character varying NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);

-- ДАННЫЕ

-- Данные _prisma_migrations
INSERT INTO public._prisma_migrations VALUES ('d86ab5b7-3b4e-4936-85ad-9c0dd043e1b3', '94b9ce2f993ea1e0dbbaaa9c4ac4cb4bb39dc1b31d5ca4b8bb48e7a0e2885aa1', '2025-09-14 13:36:02.089+00', '20240915113511_init', NULL, NULL, '2025-09-14 13:36:01.9+00', 1);
INSERT INTO public._prisma_migrations VALUES ('76fc10a3-0b8d-49e6-96c1-1e1b5f6ef9a7', '1be94fb28b87e81e6b2daf4b72fd67c7962cba1e83b7aa3b2c8ce2bd5a9bb31d', '2025-09-17 06:44:37.95+00', '20250917064437_add_stages_table', NULL, NULL, '2025-09-17 06:44:37.826+00', 1);

-- Данные stages (стадии проекта)
INSERT INTO public.stages VALUES ('4', 'Initiation', 1, 'gray', '2025-09-17 06:44:38.276', '2025-09-17 06:44:38.276');
INSERT INTO public.stages VALUES ('3', 'Planning', 2, 'yellow', '2025-09-17 06:44:38.276', '2025-09-17 06:44:38.276');
INSERT INTO public.stages VALUES ('2', 'Execution', 3, 'green', '2025-09-17 06:44:38.276', '2025-09-17 06:44:38.276');
INSERT INTO public.stages VALUES ('1', 'Monitoring', 4, 'blue', '2025-09-17 06:44:38.276', '2025-09-17 06:44:38.276');
INSERT INTO public.stages VALUES ('5', 'Closing', 5, 'red', '2025-09-17 06:44:38.276', '2025-09-17 06:44:38.276');

-- Данные prompts (промпты управления проектами)
INSERT INTO public.prompts VALUES ('cmfkp3fnp0000n3zbc8aqcbwr', 'Анализ заинтересованных сторон', 'stakeholder-analysis', 'Системный подход к выявлению и анализу всех заинтересованных сторон проекта для эффективного управления ожиданиями', 'Initiation', 'Проведите анализ заинтересованных сторон проекта:

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
   - Частоту коммуникаций', '2025-09-15 05:40:19.333', '2025-09-15 05:40:19.333', 'Denis Nikolaev', 'https://www.linkedin.com/in/nikden/', '4');

INSERT INTO public.prompts VALUES ('cmfkp3fp20001n3zbi29g4io6', 'Декомпозиция работ (WBS)', 'work-breakdown-structure', 'Создание иерархической структуры декомпозиции работ для детального планирования и контроля выполнения проекта', 'Planning', 'Разработайте структуру декомпозиции работ (WBS) для проекта:

1. Определите основные фазы проекта:
   - Анализ требований
   - Проектирование
   - Разработка/Реализация
   - Тестирование
   - Внедрение

2. Для каждой фазы выделите пакеты работ:
   - Разбейте на управляемые задачи (8-80 часов)
   - Убедитесь что все работы покрыты
   - Исключите дублирование

3. Для каждого пакета работ определите:
   - Ответственного исполнителя
   - Длительность
   - Предшествующие задачи
   - Критерии завершения
   - Необходимые ресурсы

4. Создайте иерархическую нумерацию (1.1, 1.2, 1.2.1, etc.)', '2025-09-15 05:40:19.333', '2025-09-15 05:40:19.333', 'Denis Nikolaev', 'https://www.linkedin.com/in/nikden/', '3');

INSERT INTO public.prompts VALUES ('cmfkp3fpu0002n3zbpid7t53v', 'Оценка рисков проекта', 'project-risk-assessment', 'Комплексная методология идентификации, анализа и планирования ответных мер на проектные риски', 'Planning', 'Проведите оценку рисков проекта:

1. Идентификация рисков:
   - Технические (технологии, интеграции)
   - Ресурсные (люди, бюджет, время)
   - Внешние (рынок, конкуренты, регуляторы)
   - Организационные (процессы, коммуникации)

2. Качественный анализ:
   - Вероятность (Высокая/Средняя/Низкая)
   - Воздействие (Критическое/Значительное/Умеренное/Низкое)
   - Матрица рисков (Вероятность × Воздействие)

3. Количественный анализ (для топ-рисков):
   - Ожидаемая монетарная стоимость
   - Анализ чувствительности
   - Моделирование Монте-Карло

4. Планирование ответных мер:
   - Избежание (изменение плана)
   - Снижение (уменьшение вероятности/воздействия)
   - Передача (страхование, субподряд)
   - Принятие (резервы)', '2025-09-15 05:40:19.333', '2025-09-15 05:40:19.333', 'Denis Nikolaev', 'https://www.linkedin.com/in/nikden/', '3');

INSERT INTO public.prompts VALUES ('cmfkp3fqn0003n3zbnsbbhtlr', 'План коммуникаций', 'communication-plan', 'Структурированный подход к планированию эффективных коммуникаций между всеми участниками проекта', 'Execution', 'Разработайте план коммуникаций проекта:

1. Анализ потребностей в коммуникациях:
   - Кто нуждается в какой информации
   - Когда информация нужна
   - В каком формате предоставлять
   - Через какие каналы передавать

2. Матрица коммуникаций:
   - Отправитель → Получатель
   - Тип информации
   - Частота передачи
   - Метод доставки
   - Ответственный за передачу

3. Регулярные коммуникации:
   - Статусные отчеты (еженедельно)
   - Совещания команды (ежедневно/еженедельно)
   - Отчеты заказчику (по вехам)
   - Эскалация проблем

4. Каналы коммуникаций:
   - Формальные (документы, презентации)
   - Неформальные (личные беседы, чаты)
   - Инструменты (email, мессенджеры, системы управления)', '2025-09-15 05:40:19.333', '2025-09-15 05:40:19.333', 'Denis Nikolaev', 'https://www.linkedin.com/in/nikden/', '2');

INSERT INTO public.prompts VALUES ('cmfkp3frf0004n3zbkt4hjp9t', 'Мониторинг прогресса проекта', 'project-progress-monitoring', 'Комплексная система отслеживания выполнения проекта с использованием ключевых метрик и индикаторов', 'Monitoring', 'Организуйте систему мониторинга прогресса проекта:

1. Ключевые метрики отслеживания:
   - Выполнение по срокам (Schedule Performance Index)
   - Выполнение по бюджету (Cost Performance Index)
   - Качество поставляемых результатов
   - Использование ресурсов
   - Количество изменений/рисков

2. Методы мониторинга:
   - Освоенный объем (Earned Value Management)
   - Процент физического завершения
   - Достижение промежуточных результатов
   - Burn-down/Burn-up диаграммы

3. Периодичность контроля:
   - Ежедневные standup встречи
   - Еженедельные статус-отчеты
   - Ежемесячные обзоры с заказчиком
   - Контрольные точки по вехам

4. Корректирующие действия:
   - Анализ отклонений
   - Планирование восстановления
   - Изменение ресурсов/сроков
   - Эскалация критических проблем', '2025-09-15 05:40:19.333', '2025-09-15 05:40:19.333', 'Denis Nikolaev', 'https://www.linkedin.com/in/nikden/', '1');

INSERT INTO public.prompts VALUES ('cmfkp3fs80005n3zbknlyggpu', 'Ретроспектива проекта', 'project-retrospective', 'Структурированный анализ завершенного проекта для извлечения уроков и улучшения будущих проектов', 'Closing', 'Проведите ретроспективу завершенного проекта:

1. Анализ достижения целей:
   - Соответствие первоначальным требованиям
   - Выполнение по срокам и бюджету
   - Качество поставленных результатов
   - Удовлетворенность заказчика

2. Что прошло хорошо (Keep):
   - Эффективные процессы и практики
   - Успешные решения проблем
   - Хорошо работающие инструменты
   - Позитивная командная динамика

3. Что требует улучшения (Drop):
   - Проблемные процессы
   - Неэффективные инструменты
   - Коммуникационные сбои
   - Ресурсные ограничения

4. Рекомендации для будущих проектов (Try):
   - Новые методологии
   - Улучшенные процессы
   - Дополнительное обучение команды
   - Изменения в планировании

5. Документирование уроков:
   - База знаний организации
   - Обновление стандартов и шаблонов
   - Передача опыта другим командам', '2025-09-15 05:40:19.333', '2025-09-15 05:40:19.333', 'Denis Nikolaev', 'https://www.linkedin.com/in/nikden/', '5');

INSERT INTO public.prompts VALUES ('cmfnnbodl0001qk3ibz6bgk6l', 'Test Prompt for DB Structure', 'test-prompt-db', 'This is a test prompt to verify database structure with foreign keys', 'Planning', 'This is a test prompt content to verify that the database structure works correctly with foreign key relationships between prompts and stages tables.', '2025-09-16 20:48:23.997', '2025-09-16 20:48:23.997', '', '', '3');

-- Данные stage_order_overrides (пусто, но таблица должна существовать)

--
-- ПЕРВИЧНЫЕ КЛЮЧИ И ОГРАНИЧЕНИЯ
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.prompts
    ADD CONSTRAINT prompts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.stage_order_overrides
    ADD CONSTRAINT stage_order_overrides_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.stages
    ADD CONSTRAINT stages_pkey PRIMARY KEY (id);

--
-- УНИКАЛЬНЫЕ ОГРАНИЧЕНИЯ
--

ALTER TABLE ONLY public.stages
    ADD CONSTRAINT stages_name_key UNIQUE (name);

ALTER TABLE ONLY public.stages
    ADD CONSTRAINT stages_priority_key UNIQUE (priority);

--
-- ИНДЕКСЫ
--

CREATE UNIQUE INDEX prompts_slug_key ON public.prompts USING btree (slug);
CREATE UNIQUE INDEX "stage_order_overrides_organizationId_stage_key" ON public.stage_order_overrides USING btree ("organizationId", stage);

--
-- ВНЕШНИЕ КЛЮЧИ
--

ALTER TABLE ONLY public.prompts
    ADD CONSTRAINT "prompts_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES public.stages(id) ON UPDATE CASCADE ON DELETE SET NULL;

--
-- ЗАВЕРШЕНИЕ ДАМПА
--