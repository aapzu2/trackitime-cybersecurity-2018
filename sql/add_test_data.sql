INSERT INTO "User" ("name", "username", "password", "isAdmin")
VALUES ('Admin Tester', 'admin', '$2a$04$w5ys/4PwdFlIhcuTZuE07OTtvbkmHuwaRgQJCFaPWmDkjagBWpQoK', '1') 
RETURNING "id", "name", "username", "password", "isAdmin";

INSERT INTO "User" ("name", "username", "password", "isAdmin")
VALUES ('Basic Tester', 'tester', '$2a$04$cvW4XJmvUWt1eO3v0lX.QOLcmZv.I2Iktkrq8d.U2of7YTVSVRbay', '0') 
RETURNING "id", "name", "username", "password", "isAdmin";

