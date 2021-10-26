--
-- PostgreSQL database dump
--

-- Dumped from database version 12.8 (Ubuntu 12.8-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.8 (Ubuntu 12.8-0ubuntu0.20.04.1)

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
-- Name: order_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_table (
    id integer NOT NULL,
    sell_amt numeric(78,0),
    sell_token character(42) NOT NULL,
    buy_amt numeric(78,0),
    buy_token character(42) NOT NULL,
    owner character(42) NOT NULL,
    "timestamp" numeric(20,0),
    signature character(132) NOT NULL,
    price numeric(18,0),
    lowest_sell_price numeric(18,0)
);


ALTER TABLE public.order_table OWNER TO postgres;

--
-- Name: order_table_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.order_table ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.order_table_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: update_order_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.update_order_table (
    id integer NOT NULL,
    sell_amt numeric(78,0),
    sell_token character(42) NOT NULL,
    buy_amt numeric(78,0),
    buy_token character(42) NOT NULL,
    owner character(42) NOT NULL,
    "timestamp" numeric(20,0),
    signature character(132) NOT NULL,
    price numeric(18,0),
    lowest_sell_price numeric(18,0)
);


ALTER TABLE public.update_order_table OWNER TO postgres;

--
-- Name: update_order_table_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.update_order_table ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.update_order_table_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user_balance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_balance (
    id integer NOT NULL,
    address character(42) NOT NULL,
    token_address character(42) NOT NULL,
    balance numeric
);


ALTER TABLE public.user_balance OWNER TO postgres;

--
-- Name: user_balance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.user_balance ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_balance_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: order_table; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_table (id, sell_amt, sell_token, buy_amt, buy_token, owner, "timestamp", signature, price, lowest_sell_price) FROM stdin;
\.


--
-- Data for Name: update_order_table; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.update_order_table (id, sell_amt, sell_token, buy_amt, buy_token, owner, "timestamp", signature, price, lowest_sell_price) FROM stdin;
\.


--
-- Data for Name: user_balance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_balance (id, address, token_address, balance) FROM stdin;
\.


--
-- Name: order_table_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_table_id_seq', 1, false);


--
-- Name: update_order_table_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.update_order_table_id_seq', 1, false);


--
-- Name: user_balance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_balance_id_seq', 1, false);


--
-- Name: order_table order_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_table
    ADD CONSTRAINT order_table_pkey PRIMARY KEY (id);


--
-- Name: update_order_table update_order_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.update_order_table
    ADD CONSTRAINT update_order_table_pkey PRIMARY KEY (id);


--
-- Name: user_balance user_balance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_balance
    ADD CONSTRAINT user_balance_pkey PRIMARY KEY (id);


--
-- Name: user_balance user_order_pair_constraint; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_balance
    ADD CONSTRAINT user_order_pair_constraint UNIQUE (address, token_address);


--
-- PostgreSQL database dump complete
--

