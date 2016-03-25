CREATE TABLE IF NOT EXISTS "user" (
	"id" SERIAL PRIMARY KEY,
	"name" TEXT,
	"username" TEXT UNIQUE NOT NULL CHECK ("username" <> ''),
	"password" TEXT NOT NULL,
	"isAdmin" BOOLEAN DEFAULT false
);
CREATE TABLE IF NOT EXISTS "project" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL CHECK ("name" <> ''),
  "description" TEXT,
  "started" DATE NOT NULL,
  "user" INTEGER REFERENCES "user"
);
CREATE TABLE IF NOT EXISTS "instance" (
  "id" SERIAL PRIMARY KEY,
  "description" TEXT,
  "from" TIMESTAMPTZ NOT NULL,
  "to" TIMESTAMPTZ NOT NULL,
  "project" INTEGER REFERENCES "project"
);