-- Table: public.riders

-- DROP TABLE public.riders;
CREATE SEQUENCE "riders_id_seq"
INCREMENT 1
MINVALUE 1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

CREATE SEQUENCE "leagues_id_seq"
INCREMENT 1
MINVALUE 1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

CREATE SEQUENCE "season_weeks_season_weeksid_seq"
INCREMENT 1
MINVALUE 1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

CREATE SEQUENCE "seasons_seasonid_seq"
INCREMENT 1
MINVALUE 1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

CREATE SEQUENCE "users_id_seq"
INCREMENT 1
MINVALUE 1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

CREATE SEQUENCE "weekly_team_id_seq"
INCREMENT 1
MINVALUE 1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

CREATE TABLE raceresults (
    raceresultsid SERIAL PRIMARY KEY ,
    seasonid INT REFERENCES seasons(seasonid) NOT NULL,
    weekid INT REFERENCES season_weeks(season_weeksid) NOT NULL,
    riderid INT REFERENCES riders(id) NOT NULL,
    place INT NOT NULL,
    points INT NOT NULL
)

-- Table: public.sessions
-- DROP TABLE public.sessions;

CREATE TABLE public.sessions
(
sid character varying(255) COLLATE pg_catalog."default" NOT NULL,
sess json NOT NULL,
expired timestamp with time zone NOT NULL,
CONSTRAINT sessions_pkey PRIMARY KEY (sid)
)
WITH (
OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.sessions
OWNER to postgres;


-- Table: public.users
-- DROP TABLE public.users;

CREATE TABLE public.users
(
id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
email character varying(200) COLLATE pg_catalog."default" NOT NULL,
username character varying(200) COLLATE pg_catalog."default" NOT NULL,
password character varying(200) COLLATE pg_catalog."default" NOT NULL,
CONSTRAINT users_pkey PRIMARY KEY (id),
CONSTRAINT add UNIQUE (username),
CONSTRAINT users_email_key UNIQUE (email)
)
WITH (
OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.users
OWNER to postgres;

--Table: public.riders
--DROP TABLE public.riders

CREATE TABLE public.riders
(
id integer NOT NULL DEFAULT nextval('riders_id_seq'::regclass),
name character varying(50) COLLATE pg_catalog."default" NOT NULL,
avatar_url character varying(200) COLLATE pg_catalog."default",
cost integer NOT NULL DEFAULT 1,
rider_number integer NOT NULL,
active boolean NOT NULL DEFAULT true,
CONSTRAINT riders_pkey PRIMARY KEY (id)
)
WITH (
OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.riders
OWNER to postgres;

-- Table: public.leagues
-- DROP TABLE public.leagues;

CREATE TABLE public.leagues
(
id integer NOT NULL DEFAULT nextval('leagues_id_seq'::regclass),
name character varying(200) COLLATE pg_catalog."default" NOT NULL,
privacysetting integer NOT NULL DEFAULT 1,
maxusers integer NOT NULL,
adminid integer NOT NULL,
CONSTRAINT leagues_pkey PRIMARY KEY (id),
CONSTRAINT leagues_adminid_fkey FOREIGN KEY (adminid)
REFERENCES public.users (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION
)
WITH (
OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.leagues
OWNER to postgres;


-- Table: public.seasons
-- DROP TABLE public.seasons;

CREATE TABLE public.seasons
(
seasonid bigint NOT NULL DEFAULT nextval('seasons_seasonid_seq'::regclass),
start_date date NOT NULL,
end_date date NOT NULL,
season_name character varying(200) COLLATE pg_catalog."default" NOT NULL,
CONSTRAINT seasons_pkey PRIMARY KEY (seasonid)
)
WITH (
OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.seasons
OWNER to postgres;

-- Table: public.season_weeks
-- DROP TABLE public.season_weeks;

CREATE TABLE public.season_weeks
(
season_weeksid bigint NOT NULL DEFAULT nextval('season_weeks_season_weeksid_seq'::regclass),
seasonid integer NOT NULL,
description character varying(200) COLLATE pg_catalog."default" NOT NULL,
week_number integer NOT NULL DEFAULT 1,
CONSTRAINT season_weeks_pkey PRIMARY KEY (season_weeksid),
CONSTRAINT season_weeks_seasonid_fkey FOREIGN KEY (seasonid)
REFERENCES public.seasons (seasonid) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION
)
WITH (
OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.season_weeks
OWNER to postgres;

-- Table: public.weekly_team
-- DROP TABLE public.weekly_team;

CREATE TABLE public.weekly_team
(
id integer NOT NULL DEFAULT nextval('weekly_team_id_seq'::regclass),
userid integer NOT NULL,
leagueid integer NOT NULL,
seasonid integer NOT NULL,
riderid integer NOT NULL,
season_weeksid integer NOT NULL,
points integer NOT NULL DEFAULT 25,
CONSTRAINT weekly_team_pkey PRIMARY KEY (id),
CONSTRAINT weekly_team_leagueid_fkey FOREIGN KEY (leagueid)
REFERENCES public.leagues (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION,
CONSTRAINT weekly_team_riderid_fkey FOREIGN KEY (riderid)
REFERENCES public.riders (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION,
CONSTRAINT weekly_team_season_weeksid_fkey FOREIGN KEY (season_weeksid)
REFERENCES public.season_weeks (season_weeksid) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION,
CONSTRAINT weekly_team_seasonid_fkey FOREIGN KEY (seasonid)
REFERENCES public.seasons (seasonid) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION,
CONSTRAINT weekly_team_userid_fkey FOREIGN KEY (userid)
REFERENCES public.users (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION
)
WITH (
OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.weekly_team
OWNER to postgres;
