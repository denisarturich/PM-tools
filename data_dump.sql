--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (02a153c)
-- Dumped by pg_dump version 16.9

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

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

SET SESSION AUTHORIZATION DEFAULT;

ALTER TABLE public._prisma_migrations DISABLE TRIGGER ALL;

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
a514bfb7-db50-42c6-871d-7885ad286939	c922bdffabb90b3ed5e7c6f1a767744155b803604f210df6fb5e7fc5ffb86171	2025-09-15 05:39:24.043502+00	20250915053923_init	\N	\N	2025-09-15 05:39:23.960011+00	1
4b25aa1d-05de-439e-b436-5f56303b2008	39be2e12daa02f74dc6cf605f8f4b27129002e17066726749f2690b9ced7ff72	2025-09-16 06:11:57.166179+00	20250916061156_add_stage_order_overrides	\N	\N	2025-09-16 06:11:57.069255+00	1
faa7d3be-9c07-4f35-938a-8303484a5854	86ae671238c3f0e5084b00ed24aae8e507d8a99dd8bed6a45031ef87208d4654	2025-09-16 06:35:03.900335+00	20250916063503_add_author_fields	\N	\N	2025-09-16 06:35:03.82118+00	1
\.


ALTER TABLE public._prisma_migrations ENABLE TRIGGER ALL;

--
-- Data for Name: stages; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.stages DISABLE TRIGGER ALL;

COPY public.stages (id, name, priority, color, "createdAt", "updatedAt") FROM stdin;
1	Monitoring	4	blue	2025-09-17 06:44:38.276	2025-09-17 06:44:38.276
2	Execution	3	green	2025-09-17 06:44:38.276	2025-09-17 06:44:38.276
3	Planning	2	yellow	2025-09-17 06:44:38.276	2025-09-17 06:44:38.276
5	Closing	5	red	2025-09-17 06:44:38.276	2025-09-17 06:44:38.276
4	Initiation	1	gray	2025-09-17 06:44:38.276	2025-09-17 06:44:38.276
\.


ALTER TABLE public.stages ENABLE TRIGGER ALL;

--
-- Data for Name: prompts; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.prompts DISABLE TRIGGER ALL;

COPY public.prompts (id, title, slug, summary, stage, "fullText", "createdAt", "updatedAt", "authorName", "authorUrl", "stageId") FROM stdin;
cmfkp3fqn0003n3zbnsbbhtlr	План коммуникаций	communication-plan	Структурированный подход к планированию коммуникаций с заинтересованными сторонами	Execution	Разработайте план коммуникаций проекта:\n\n1. Определите потребности в коммуникациях:\n   - Кто нуждается в информации\n   - Какая информация нужна\n   - Когда нужна информация\n   - В каком формате\n\n2. Выберите каналы коммуникации:\n   - Официальные отчеты\n   - Встречи и презентации\n   - Email-рассылки\n   - Корпоративные платформы\n\n3. Установите график коммуникаций:\n   - Еженедельные статусы\n   - Ежемесячные отчеты\n   - Критические уведомления\n   - Итоговые презентации\n\n4. Определите ответственности:\n   - Кто готовит информацию\n   - Кто утверждает\n   - Кто распространяет	2025-09-15 05:40:19.439	2025-09-15 05:40:19.439	Denis Nikolaev	https://www.linkedin.com/in/nikden/	2
cmfkp3fp20001n3zbi29g4io6	Декомпозиция работ (WBS)	work-breakdown-structure	Структурированный подход к разбиению проекта на управляемые компоненты и задачи	Planning	Создайте структуру декомпозиции работ (WBS):\n\n1. Определите основные результаты проекта:\n   - Ключевые поставки (deliverables)\n   - Промежуточные результаты\n   - Критерии приемки\n\n2. Декомпозируйте каждый результат:\n   - Разбейте на подзадачи\n   - Определите зависимости\n   - Установите иерархию\n\n3. Для каждого элемента WBS определите:\n   - Объем работ\n   - Ресурсы\n   - Временные рамки\n   - Ответственных\n\n4. Создайте WBS-словарь:\n   - Описание каждого элемента\n   - Критерии завершения\n   - Связанные риски	2025-09-15 05:40:19.382	2025-09-15 05:40:19.382	Denis Nikolaev	https://www.linkedin.com/in/nikden/	3
cmfkp3fs80005n3zbknlyggpu	Ретроспектива проекта	project-retrospective	Структурированный анализ проекта для извлечения уроков и улучшения процессов	Closing	Проведите ретроспективу проекта:\n\n1. Подготовьте данные для анализа:\n   - Финальные метрики проекта\n   - Обратную связь стейкхолдеров\n   - Документацию процессов\n   - Зафиксированные проблемы\n\n2. Проанализируйте что прошло хорошо:\n   - Успешные практики\n   - Эффективные решения\n   - Удачные коммуникации\n   - Позитивные моменты\n\n3. Определите области для улучшения:\n   - Проблемные процессы\n   - Неэффективные решения\n   - Коммуникационные сбои\n   - Ресурсные ограничения\n\n4. Создайте план действий:\n   - Документируйте уроки\n   - Обновите процессы\n   - Поделитесь знаниями\n   - Внедрите улучшения	2025-09-15 05:40:19.496	2025-09-15 05:40:19.496	Denis Nikolaev	https://www.linkedin.com/in/nikden/	5
cmfkp3frf0004n3zbkt4hjp9t	Мониторинг прогресса проекта	progress-monitoring	Система отслеживания ключевых показателей эффективности проекта	Monitoring	Организуйте мониторинг прогресса проекта:\n\n1. Определите KPI проекта:\n   - Временные показатели (соблюдение сроков)\n   - Бюджетные показатели (CPI, AC, EV)\n   - Качественные показатели\n   - Показатели удовлетворенности\n\n2. Настройте систему отчетности:\n   - Dashboard с ключевыми метриками\n   - Еженедельные статус-отчеты\n   - Анализ трендов\n   - Прогнозирование\n\n3. Проводите регулярный анализ:\n   - Отклонения от плана\n   - Причины задержек\n   - Эффективность ресурсов\n   - Качество результатов\n\n4. Принимайте корректирующие действия:\n   - Перепланирование задач\n   - Перераспределение ресурсов\n   - Изменение процессов	2025-09-15 05:40:19.468	2025-09-15 05:40:19.468	Denis Nikolaev	https://www.linkedin.com/in/nikden/	1
cmfkp3fpu0002n3zbpid7t53v	Оценка рисков проекта	risk-assessment	Матрица вероятности и влияния для систематической оценки проектных рисков	Planning	Проведите оценку рисков проекта:\n\n1. Идентификация рисков:\n   - Технические риски\n   - Ресурсные риски\n   - Временные риски\n   - Внешние риски\n\n2. Анализ по матрице вероятность/влияние:\n   - Высокая вероятность, высокое влияние: критические\n   - Высокая вероятность, низкое влияние: мониторить\n   - Низкая вероятность, высокое влияние: планировать\n   - Низкая вероятность, низкое влияние: принять\n\n3. Разработайте стратегии реагирования:\n   - Избежание\n   - Снижение\n   - Передача\n   - Принятие\n\n4. Создайте план управления рисками:\n   - Владельцы рисков\n   - Триггеры\n   - Планы действий	2025-09-15 05:40:19.411	2025-09-15 05:40:19.411	Denis Nikolaev	https://www.linkedin.com/in/nikden/	3
cmfkp3fnp0000n3zbc8aqcbwr	Анализ заинтересованных сторон	stakeholder-analysis	Системный подход к выявлению и анализу всех заинтересованных сторон проекта для эффективного управления ожиданиями	Initiation	Проведите анализ заинтересованных сторон проекта:\n\n1. Идентификация стейкхолдеров:\n   - Внутренние (команда, руководство, отделы)\n   - Внешние (клиенты, поставщики, регуляторы)\n   - Ключевые (высокое влияние/интерес)\n   - Второстепенные (низкое влияние/интерес)\n\n2. Анализ по матрице влияние/интерес:\n   - Высокое влияние, высокий интерес: управлять тесно\n   - Высокое влияние, низкий интерес: держать довольными\n   - Низкое влияние, высокий интерес: держать в курсе\n   - Низкое влияние, низкий интерес: мониторить\n\n3. Определите для каждого стейкхолдера:\n   - Ожидания от проекта\n   - Потенциальные риски\n   - Стратегию взаимодействия\n   - Частоту коммуникаций	2025-09-15 05:40:19.333	2025-09-15 05:40:19.333	Denis Nikolaev	https://www.linkedin.com/in/nikden/	4
cmfnnbodl0001qk3ibz6bgk6l	Test Prompt for DB Structure	test-prompt-for-db-structure	Testing new stageId relationships	Planning	This is a test prompt to verify stageId assignment	2025-09-17 07:14:03.177	2025-09-17 07:14:03.177	\N	\N	3
\.


ALTER TABLE public.prompts ENABLE TRIGGER ALL;

--
-- Data for Name: stage_order_overrides; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.stage_order_overrides DISABLE TRIGGER ALL;

COPY public.stage_order_overrides (id, "organizationId", stage, weight, "createdAt", "updatedAt") FROM stdin;
\.


ALTER TABLE public.stage_order_overrides ENABLE TRIGGER ALL;

--
-- PostgreSQL database dump complete
--

