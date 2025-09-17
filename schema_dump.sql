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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
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
-- Name: prompts; Type: TABLE; Schema: public; Owner: -
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
-- Name: stage_order_overrides; Type: TABLE; Schema: public; Owner: -
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
-- Name: stages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stages (
    id text NOT NULL,
    name character varying(100) NOT NULL,
    priority integer NOT NULL,
    color character varying(50) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: prompts prompts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prompts
    ADD CONSTRAINT prompts_pkey PRIMARY KEY (id);


--
-- Name: stage_order_overrides stage_order_overrides_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stage_order_overrides
    ADD CONSTRAINT stage_order_overrides_pkey PRIMARY KEY (id);


--
-- Name: stages stages_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stages
    ADD CONSTRAINT stages_name_key UNIQUE (name);


--
-- Name: stages stages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stages
    ADD CONSTRAINT stages_pkey PRIMARY KEY (id);


--
-- Name: stages stages_priority_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stages
    ADD CONSTRAINT stages_priority_key UNIQUE (priority);


--
-- Name: prompts_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX prompts_slug_key ON public.prompts USING btree (slug);


--
-- Name: stage_order_overrides_organizationId_stage_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "stage_order_overrides_organizationId_stage_key" ON public.stage_order_overrides USING btree ("organizationId", stage);


--
-- Name: prompts prompts_stageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prompts
    ADD CONSTRAINT "prompts_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES public.stages(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

