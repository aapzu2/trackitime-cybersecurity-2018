const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')

fs.unlinkSync('sqlite.db')
const db = new sqlite3.Database('sqlite.db')

createTables()
    .then(() => {
        db.all('SELECT * FROM User where username = "admin"', {}, (err, result) => {
            if (err) {
                throw err
            }
            if (!result.length) {
                addTestData()
            }
        })
    })

class DBClient {
    query(query, params) {
        return new Promise((resolve, reject) => {
            db.all(query, params, (err, result) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }
    first(query, params) {
        return this.query(query, params)
            .then((result) => result[0])
    }
}

function createTables() {
    const scripts = [
        `
CREATE TABLE IF NOT EXISTS "User" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"name" TEXT,
	"username" TEXT UNIQUE NOT NULL CHECK ("username" <> ''),
	"password" TEXT NOT NULL,
	"isAdmin" BOOLEAN DEFAULT false
);
    `, `
CREATE TABLE IF NOT EXISTS "Project" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"name" TEXT NOT NULL CHECK ("name" <> ''),
	"description" TEXT,
	"started" DATE NOT NULL
);
    `, `
CREATE TABLE IF NOT EXISTS "UserProject" (
	"project" INTEGER REFERENCES Project(id),
	"user" INTEGER REFERENCES User(id),
	"isAdmin" BOOLEAN DEFAULT true,
	CONSTRAINT fk_project
        FOREIGN KEY (project)
        REFERENCES Project (id)
        ON DELETE CASCADE,
	CONSTRAINT fk_user
        FOREIGN KEY (user)
        REFERENCES User (id)
        ON DELETE CASCADE,
	PRIMARY KEY("project", "user")
);
    `, `
CREATE TABLE IF NOT EXISTS "TimeInstance" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"description" TEXT,
	"from" TIMESTAMPTZ NOT NULL,
	"to" TIMESTAMPTZ NOT NULL,
	"project" INTEGER,
	"user" INTEGER,
	CONSTRAINT fk_project
        FOREIGN KEY (project)
        REFERENCES Project (id)
        ON DELETE CASCADE,
	CONSTRAINT fk_user
        FOREIGN KEY (user)
        REFERENCES User (id)
        ON DELETE CASCADE
);
    `]
    return Promise.all(scripts.map((s) => new Promise((resolve, reject) => {
        db.run(s, {}, (err) => {
            if (err) {
                reject(err)
            }
            resolve()
        })
    })))
}

function addTestData() {
    db.run(`
INSERT INTO "User" ("id", "name", "username", "password", "isAdmin")
VALUES ('0', 'Admin Tester', 'admin', '$2a$04$Y/Congw7ZNafYpNwNLAjHOE7KTa/YAUvhWW9ouZh32EMZnb0IiBMC', '1'),
    ('1', 'Basic Tester', 'tester', '$2a$10$PIsSeT8bfYM0qQ4tR2U0T.2AoDuQ/48AzJy.Oc6tmoYc6lKwOJOTm', '0');
    `)
    db.run(`
INSERT INTO "Project"("id", "name", "started", "description")
VALUES ('0', 'Muutto', '2016-04-01', 'Muutetaan uuteen kotiin'),
    ('1', 'HIMYM', '2016-03-24', 'Pakko katsoa');
    `)
    db.run(`
INSERT INTO "UserProject"("user", "project", "isAdmin") 
VALUES ('0', '0', '1'), ('1', '0', '0'), ('0', '1', '1');
    `)
    db.run(`
INSERT INTO "TimeInstance"("description", "from", "to", "project", "user") 
VALUES ('Watched the first two seasons', '2016-03-01 12:00', '2016-03-01 14:00', '0', '0'),
    ('Kamat sisään', '2016-04-02 10:00', '2016-04-02 13:00', '1', '0');
    `)
}

module.exports = new DBClient()
