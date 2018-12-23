INSERT INTO "User" ("id", "name", "username", "password", "isAdmin")
VALUES ('0', 'Admin Tester', 'admin', '$2a$04$Y/Congw7ZNafYpNwNLAjHOE7KTa/YAUvhWW9ouZh32EMZnb0IiBMC', '1');

INSERT INTO "User" ("id", "name", "username", "password", "isAdmin")
VALUES ('1', 'Basic Tester', 'tester', '$2a$04$cvW4XJmvUWt1eO3v0lX.QOLcmZv.I2Iktkrq8d.U2of7YTVSVRbay', '0');

INSERT INTO "Project"("id", "name", "started", "description") 
VALUES('0', 'Muutto', '2016-04-01', 'Muutetaan uuteen kotiin');

INSERT INTO "Project"("id", "name", "started", "description") 
VALUES('1', 'HIMYM', '2016-03-24', 'Pakko katsoa');

INSERT INTO "UserProject"("user", "project", "isAdmin") 
VALUES('0', '0', '1');

INSERT INTO "UserProject"("user", "project", "isAdmin") 
VALUES('1', '0', '0');

INSERT INTO "UserProject"("user", "project", "isAdmin") 
VALUES('0', '1', '1');

INSERT INTO "TimeInstance"("description", "from", "to", "project", "user") 
VALUES('Watched the first two seasons', '2016-03-01 12:00', '2016-03-01 14:00', '0', '0');

INSERT INTO "TimeInstance"("description", "from", "to", "project", "user") 
VALUES('Kamat sisään', '2016-04-02 10:00', '2016-04-02 13:00', '1', '0');
