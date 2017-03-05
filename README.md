# Trackitime
### What is it?
How	many	hours	did	you	use	with	your	practice	work?	Or	with	your	origami	
project?	Trackitime	is	an application	 to	solve	 this	problem.	With	Trackitime	one	can	easily	create	a	new	project,	and	add	time	periods	spent	with	the	project.
Later	some	statistics	can	be	seen	of	the	project:	what	have	been	done,	how	much	time	have	been	spent	altogether	and	so	on.
Trackitime	is	used	with	an	easily-used web application,	which	is	also	supportive for	mobile	browsers. The	users	are	identified	with	a	logging	system	and	personal	accounts.

Trackitime is my university's database/web-app practice work (University of Helsinki).

<img src="http://data.aapzu.xyz/img/trackitime.jpg" />

### Useful links
* <a href="http://trackitime.haanpuu.fi" target="_blank">A running demo</a>
* <a href="http://trackitime.haanpuu.fi/documentation" target="_blank">The documentation of the app (PDF)</a>

### How to use locally

* `git clone https://github.com/Aapzu/trackitime`
* Go to the cloned directory
* Create a PostgreSQL database
* Create the tables by running sql/create_tables.sql to the database
* `npm install`
* `DATABASE_URL=<FULL URL> [PORT=<PORT>] npm start` where \<FULL URL\> is the PostreSQL url containing host, port, username and password and \<PORT\> the port app starts in (optional, default 8080)
* Go to [http://localhost:8080](http://localhost:8080) or http://localhost:\<PORT\>
* You can also run `sql/add_test_data.sql`to the database. That creates two test users and a couple of projects and time instances to the database. Otherwise one can always create new users by signing up to the system (but not administrators).
  * Users:
  
    | Username  | Password  | Full Name     | User Rights   |
    |---        |---        |---            |---            |
    | admin     | admin     | Admin Tester  | Administrator |
    | tester    | tester    | Basic Tester  | User          |
