INSERT INTO "User" ("name", "username", "password", "isAdmin")
VALUES ('Admin Tester', 'admin', '$2a$04$w5ys/4PwdFlIhcuTZuE07OTtvbkmHuwaRgQJCFaPWmDkjagBWpQoK', '1') 
RETURNING "id", "name", "username", "password", "isAdmin";

INSERT INTO "User" ("name", "username", "password", "isAdmin")
VALUES ('Basic Tester', 'tester', '$2a$04$cvW4XJmvUWt1eO3v0lX.QOLcmZv.I2Iktkrq8d.U2of7YTVSVRbay', '0') 
RETURNING "id", "name", "username", "password", "isAdmin";

INSERT INTO "Project"("name", "started", "description") 
VALUES('Muutto', '2016-04-01', 'Muutetaan uuteen kotiin') 
RETURNING "id", "name", "started", "description";

INSERT INTO "Project"("name", "started", "description") 
VALUES('HIMYM', '2016-03-24', 'Pakko katsoa') 
RETURNING "id", "name", "started", "description";

INSERT INTO "UserProject"("user", "project") 
VALUES('0', '0')
RETURNING "user", "project";

INSERT INTO "UserProject"("user", "project") 
VALUES('1', '0')
RETURNING "user", "project";

INSERT INTO "UserProject"("user", "project") 
VALUES('0', '1')
RETURNING "user", "project";

INSERT INTO "TimeInstance"("description", "from", "to", "project", "user") 
VALUES('Watched the first two seasons', '2016-03-01 12:00', '2016-03-01 14:00', '0', '0') 
RETURNING "id", "description", "from", "to", "project", "user";

INSERT INTO "TimeInstance"("description", "from", "to", "project", "user") 
VALUES('Kamat sisään', '2016-04-02 10:00', '2016-04-02 13:00', '1', '0') 
RETURNING "id", "description", "from", "to", "project", "user";

