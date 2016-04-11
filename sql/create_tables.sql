CREATE TABLE IF NOT EXISTS "User" (
	"id" SERIAL PRIMARY KEY,
	"name" TEXT,
	"username" TEXT UNIQUE NOT NULL CHECK ("username" <> ''),
	"password" TEXT NOT NULL,
	"isAdmin" BOOLEAN DEFAULT false
);
CREATE TABLE IF NOT EXISTS "UserProject" (
	"project" INTEGER REFERENCES "Project",
	"user" INTEGER REFERENCES "User",
	"isAdmin" BOOLEAN DEFAULT true,
	PRIMARY KEY("project", "user")
);
CREATE TABLE IF NOT EXISTS "Project" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL CHECK ("name" <> ''),
  "description" TEXT,
  "started" DATE NOT NULL
);
CREATE TABLE IF NOT EXISTS "TimeInstance" (
  "id" SERIAL PRIMARY KEY,
  "description" TEXT,
  "from" TIMESTAMPTZ NOT NULL,
  "to" TIMESTAMPTZ NOT NULL,
  "project" INTEGER REFERENCES "project"
);
