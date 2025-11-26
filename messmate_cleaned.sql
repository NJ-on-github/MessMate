--
-- Cleaned PostgreSQL SQL dump (safe for Supabase)
-- - Removed DROP/CREATE DATABASE and \connect
-- - Removed role/owner statements (none present)
-- - Set search_path to public
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET search_path = public;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Types
--

CREATE TYPE public.payment_status AS ENUM (
    'pending',
    'paid'
);

CREATE TYPE public.reg_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'student'
);

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Tables and sequences
--

CREATE TABLE public.account_status (
    student_id integer NOT NULL,
    is_blocked boolean DEFAULT false,
    blocked_reason text
);

CREATE TABLE public.admins (
    admin_id integer NOT NULL,
    user_id integer NOT NULL
);

CREATE SEQUENCE public.admins_admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.admins_admin_id_seq OWNED BY public.admins.admin_id;

CREATE TABLE public.breakfast_items (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text
);

CREATE SEQUENCE public.breakfast_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.breakfast_items_id_seq OWNED BY public.breakfast_items.id;

CREATE TABLE public.dinner_items (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text
);

CREATE SEQUENCE public.dinner_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.dinner_items_id_seq OWNED BY public.dinner_items.id;

CREATE TABLE public.fees_structure (
    fee_id integer NOT NULL,
    monthly_fee numeric(10,2) NOT NULL,
    effective_from date NOT NULL
);

CREATE SEQUENCE public.fees_structure_fee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.fees_structure_fee_id_seq OWNED BY public.fees_structure.fee_id;

CREATE TABLE public.lunch_items (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text
);

CREATE SEQUENCE public.lunch_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.lunch_items_id_seq OWNED BY public.lunch_items.id;

CREATE TABLE public.payments (
    payment_id integer NOT NULL,
    student_id integer NOT NULL,
    fee_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_status public.payment_status DEFAULT 'pending'::public.payment_status,
    payment_date date,
    due_date date NOT NULL,
    month_year character varying(7) NOT NULL
);

CREATE SEQUENCE public.payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;

CREATE TABLE public.students (
    student_id integer NOT NULL,
    user_id integer NOT NULL,
    hostel_name character varying(100) NOT NULL,
    branch character varying(100) NOT NULL,
    registration_status public.reg_status DEFAULT 'pending'::public.reg_status
);

CREATE SEQUENCE public.students_student_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.students_student_id_seq OWNED BY public.students.student_id;

CREATE TABLE public.todays_breakfast (
    id integer NOT NULL,
    todays_menu_id integer NOT NULL,
    breakfast_item_id integer NOT NULL
);

CREATE SEQUENCE public.todays_breakfast_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.todays_breakfast_id_seq OWNED BY public.todays_breakfast.id;

CREATE TABLE public.todays_dinner (
    id integer NOT NULL,
    todays_menu_id integer NOT NULL,
    dinner_item_id integer NOT NULL
);

CREATE SEQUENCE public.todays_dinner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.todays_dinner_id_seq OWNED BY public.todays_dinner.id;

CREATE TABLE public.todays_lunch (
    id integer NOT NULL,
    todays_menu_id integer NOT NULL,
    lunch_item_id integer NOT NULL
);

CREATE SEQUENCE public.todays_lunch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.todays_lunch_id_seq OWNED BY public.todays_lunch.id;

CREATE TABLE public.todays_menu (
    id integer NOT NULL,
    menu_date date NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.todays_menu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.todays_menu_id_seq OWNED BY public.todays_menu.id;

CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role public.user_role NOT NULL
);

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;

--
-- Defaults for serial/sequence-backed columns
--

ALTER TABLE ONLY public.admins ALTER COLUMN admin_id SET DEFAULT nextval('public.admins_admin_id_seq'::regclass);
ALTER TABLE ONLY public.breakfast_items ALTER COLUMN id SET DEFAULT nextval('public.breakfast_items_id_seq'::regclass);
ALTER TABLE ONLY public.dinner_items ALTER COLUMN id SET DEFAULT nextval('public.dinner_items_id_seq'::regclass);
ALTER TABLE ONLY public.fees_structure ALTER COLUMN fee_id SET DEFAULT nextval('public.fees_structure_fee_id_seq'::regclass);
ALTER TABLE ONLY public.lunch_items ALTER COLUMN id SET DEFAULT nextval('public.lunch_items_id_seq'::regclass);
ALTER TABLE ONLY public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);
ALTER TABLE ONLY public.students ALTER COLUMN student_id SET DEFAULT nextval('public.students_student_id_seq'::regclass);
ALTER TABLE ONLY public.todays_breakfast ALTER COLUMN id SET DEFAULT nextval('public.todays_breakfast_id_seq'::regclass);
ALTER TABLE ONLY public.todays_dinner ALTER COLUMN id SET DEFAULT nextval('public.todays_dinner_id_seq'::regclass);
ALTER TABLE ONLY public.todays_lunch ALTER COLUMN id SET DEFAULT nextval('public.todays_lunch_id_seq'::regclass);
ALTER TABLE ONLY public.todays_menu ALTER COLUMN id SET DEFAULT nextval('public.todays_menu_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);

--
-- Table data
--

COPY public.account_status (student_id, is_blocked, blocked_reason) FROM stdin;
1	f	\N
5	f	\N
8	f	\N
7	t	Payment defaulted for 2025-05
9	f	\N
11	f	\N
12	f	\N
13	f	\N
14	f	\N
10	t	Payment defaulted for 2025-06
6	f	\N
4	t	Payment defaulted for 2025-06
15	f	\N
\.

COPY public.admins (admin_id, user_id) FROM stdin;
\.

COPY public.breakfast_items (id, name, description) FROM stdin;
2	Chai	\N
3	Idli Sambhar	\N
4	Poha	\N
\.

COPY public.dinner_items (id, name, description) FROM stdin;
1	Masala Dosa	\N
2	Dal Tadka	\N
3	Chapati	\N
\.

COPY public.fees_structure (fee_id, monthly_fee, effective_from) FROM stdin;
1	2500.00	2025-01-01
2	2000.00	2025-02-01
3	1800.00	2025-03-01
4	1500.00	2025-04-01
5	1600.00	2025-05-01
6	1900.00	2025-06-01
13	5000.00	2025-08-01
14	2200.00	2025-09-01
18	3500.00	2025-10-01
19	5000.00	2025-11-01
\.

COPY public.lunch_items (id, name, description) FROM stdin;
1	Aloo Paratha	\N
2	Chaach	\N
\.

COPY public.payments (payment_id, student_id, fee_id, amount, payment_status, payment_date, due_date, month_year) FROM stdin;
6	4	6	1900.00	pending	\N	2025-06-11	06-2025
7	1	13	5000.00	pending	\N	2025-08-11	08-2025
8	4	13	5000.00	pending	\N	2025-08-11	08-2025
9	1	14	2200.00	pending	\N	2025-09-11	09-2025
5	4	5	1600.00	paid	2025-05-07	2025-05-11	05-2025
10	4	14	2200.00	paid	2025-05-11	2025-09-11	09-2025
25	8	6	1900.00	pending	\N	2025-07-11	07-2025
21	7	6	1900.00	pending	\N	2025-06-11	06-2025
22	7	6	1900.00	pending	\N	2025-07-11	07-2025
26	9	5	1600.00	pending	\N	2025-05-11	05-2025
27	9	6	1900.00	pending	\N	2025-06-11	06-2025
28	9	6	1900.00	pending	\N	2025-07-11	07-2025
19	6	6	1900.00	paid	2025-05-13	2025-07-11	07-2025
20	7	5	1600.00	paid	2025-05-14	2025-05-11	05-2025
30	10	6	1900.00	paid	2025-06-23	2025-06-11	06-2025
31	10	6	1900.00	paid	2025-06-23	2025-07-11	07-2025
29	10	5	1600.00	paid	2025-06-23	2025-05-11	05-2025
17	6	5	1600.00	paid	2025-06-24	2025-05-11	05-2025
18	6	6	1900.00	paid	2025-06-25	2025-06-11	06-2025
44	1	18	3500.00	pending	\N	2025-10-11	10-2025
45	4	18	3500.00	pending	\N	2025-10-11	10-2025
46	5	18	3500.00	pending	\N	2025-10-11	10-2025
47	6	18	3500.00	pending	\N	2025-10-11	10-2025
48	7	18	3500.00	pending	\N	2025-10-11	10-2025
49	8	18	3500.00	pending	\N	2025-10-11	10-2025
50	9	18	3500.00	pending	\N	2025-10-11	10-2025
51	10	18	3500.00	pending	\N	2025-10-11	10-2025
24	8	6	1900.00	paid	2025-06-28	2025-06-11	06-2025
23	8	5	1600.00	paid	2025-06-28	2025-05-11	05-2025
52	1	19	5000.00	pending	\N	2025-11-11	11-2025
53	4	19	5000.00	pending	\N	2025-11-11	11-2025
54	5	19	5000.00	pending	\N	2025-11-11	11-2025
55	6	19	5000.00	pending	\N	2025-11-11	11-2025
56	7	19	5000.00	pending	\N	2025-11-11	11-2025
57	8	19	5000.00	pending	\N	2025-11-11	11-2025
58	9	19	5000.00	pending	\N	2025-11-11	11-2025
59	10	19	5000.00	pending	\N	2025-11-11	11-2025
\.

COPY public.students (student_id, user_id, hostel_name, branch, registration_status) FROM stdin;
1	3	Hostel_1	CS	approved
4	7	H1	CS	approved
5	9	H12	Biotech	approved
6	10	H12	CS	approved
7	11	H1	B.Tech	approved
8	12	H3	Electrical	approved
9	13	H3	Electrical	approved
10	14	H7	Electrical	approved
13	18	H1	CS	pending
14	19	h1	CS	pending
12	16	H1	Biotech	pending
11	15	H6	Electrical	rejected
15	20	H3	Electrical	pending
\.

COPY public.todays_breakfast (id, todays_menu_id, breakfast_item_id) FROM stdin;
1	1	2
2	1	3
5	2	3
6	3	2
7	3	3
8	4	4
9	4	2
10	5	4
11	6	2
12	6	3
13	7	2
14	8	4
15	8	3
16	9	4
17	9	2
18	10	4
19	11	3
20	11	2
\.

COPY public.todays_dinner (id, todays_menu_id, dinner_item_id) FROM stdin;
1	2	1
2	3	1
3	4	1
4	5	2
5	6	1
6	7	2
7	8	1
8	9	2
9	10	2
10	11	1
11	11	2
12	11	3
\.

COPY public.todays_lunch (id, todays_menu_id, lunch_item_id) FROM stdin;
1	2	1
2	3	1
3	4	1
4	4	2
5	5	1
6	6	2
7	6	1
8	7	1
9	7	2
10	8	1
11	9	1
12	9	2
13	10	1
14	11	1
\.

COPY public.todays_menu (id, menu_date, created_at) FROM stdin;
1	2025-04-27	2025-04-27 02:56:17.287977
2	2025-05-08	2025-05-08 09:25:02.639045
3	2025-05-13	2025-05-13 10:01:37.2774
4	2025-05-14	2025-05-14 04:10:16.625027
5	2025-06-15	2025-06-15 20:46:47.499227
6	2025-06-22	2025-06-22 23:09:16.282981
7	2025-06-23	2025-06-23 01:07:04.952536
8	2025-06-25	2025-06-25 00:34:01.945065
9	2025-06-28	2025-06-28 00:06:39.818755
10	2025-07-03	2025-07-03 10:55:28.3662
11	2025-11-26	2025-11-26 00:57:30.06201
\.

COPY public.users (user_id, name, email, password_hash, role) FROM stdin;
1	ramesh	ramesh@gjalf.com	password	student
2	Test student 2	test_Student_2@gjalf.com	password	student
3	Test Student	Teststudent@example.com	samplepassword	student
7	Test Student 3	testStudent3@example.com	abcd	student
8	Admin User	admin@example.com	admin123	admin
9	Test Student 4	testStudent4@example.com	abc	student
10	Test Student 5	teststudent5@example.com	abcd	student
11	Alice	Alice@example.com	abcd	student
12	John	John@example.com	abcd	student
13	Suresh	suresh@example.com	abcd	student
14	Adam	Adam@example.com	abcd	student
15	Priya	Priya@example.com	abcd	student
16	Yugi	Yugi@example.com	abcd	student
18	Wed	testStudent50@example.com	abcd	student
19	abcd	testStudent55@example.com	abcd	student
20	Harry	harry@example.com	abcd	student
\.

--
-- Sequence sets
--

SELECT pg_catalog.setval('public.admins_admin_id_seq', 1, false);
SELECT pg_catalog.setval('public.breakfast_items_id_seq', 4, true);
SELECT pg_catalog.setval('public.dinner_items_id_seq', 3, true);
SELECT pg_catalog.setval('public.fees_structure_fee_id_seq', 19, true);
SELECT pg_catalog.setval('public.lunch_items_id_seq', 2, true);
SELECT pg_catalog.setval('public.payments_payment_id_seq', 59, true);
SELECT pg_catalog.setval('public.students_student_id_seq', 15, true);
SELECT pg_catalog.setval('public.todays_breakfast_id_seq', 20, true);
SELECT pg_catalog.setval('public.todays_dinner_id_seq', 12, true);
SELECT pg_catalog.setval('public.todays_lunch_id_seq', 14, true);
SELECT pg_catalog.setval('public.todays_menu_id_seq', 11, true);
SELECT pg_catalog.setval('public.users_user_id_seq', 20, true);

--
-- Constraints
--

ALTER TABLE ONLY public.account_status
    ADD CONSTRAINT account_status_pkey PRIMARY KEY (student_id);

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (admin_id);

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_user_id_key UNIQUE (user_id);

ALTER TABLE ONLY public.breakfast_items
    ADD CONSTRAINT breakfast_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.dinner_items
    ADD CONSTRAINT dinner_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fees_structure
    ADD CONSTRAINT fees_structure_pkey PRIMARY KEY (fee_id);

ALTER TABLE ONLY public.lunch_items
    ADD CONSTRAINT lunch_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_student_id_month_year_key UNIQUE (student_id, month_year);

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (student_id);

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_user_id_key UNIQUE (user_id);

ALTER TABLE ONLY public.todays_breakfast
    ADD CONSTRAINT todays_breakfast_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.todays_dinner
    ADD CONSTRAINT todays_dinner_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.todays_lunch
    ADD CONSTRAINT todays_lunch_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.todays_menu
    ADD CONSTRAINT todays_menu_menu_date_key UNIQUE (menu_date);

ALTER TABLE ONLY public.todays_menu
    ADD CONSTRAINT todays_menu_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);

ALTER TABLE ONLY public.account_status
    ADD CONSTRAINT account_status_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(student_id);

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_fee_id_fkey FOREIGN KEY (fee_id) REFERENCES public.fees_structure(fee_id);

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(student_id);

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;

ALTER TABLE ONLY public.todays_breakfast
    ADD CONSTRAINT todays_breakfast_breakfast_item_id_fkey FOREIGN KEY (breakfast_item_id) REFERENCES public.breakfast_items(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.todays_breakfast
    ADD CONSTRAINT todays_breakfast_todays_menu_id_fkey FOREIGN KEY (todays_menu_id) REFERENCES public.todays_menu(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.todays_dinner
    ADD CONSTRAINT todays_dinner_dinner_item_id_fkey FOREIGN KEY (dinner_item_id) REFERENCES public.dinner_items(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.todays_dinner
    ADD CONSTRAINT todays_dinner_todays_menu_id_fkey FOREIGN KEY (todays_menu_id) REFERENCES public.todays_menu(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.todays_lunch
    ADD CONSTRAINT todays_lunch_lunch_item_id_fkey FOREIGN KEY (lunch_item_id) REFERENCES public.lunch_items(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.todays_lunch
    ADD CONSTRAINT todays_lunch_todays_menu_id_fkey FOREIGN KEY (todays_menu_id) REFERENCES public.todays_menu(id) ON DELETE CASCADE;

--
-- PostgreSQL database dump complete
--
