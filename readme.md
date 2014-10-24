browninternal
=============

To use these files:

1. Install meteor
2. Create a new project called "browninternal"
3. Delete the auto-generated files in the project folder and copy these files into the folder
4. Add the packages listed below with the command "meteor add [package name]"
5. Run meteor
6. Navigate to localhost:3000 to see the website

Packages:

accounts-base                 1.1.2  A user account system
accounts-github               1.0.2  Login service for Github accounts
accounts-ui                   1.1.2  Simple templates to add login widgets to...
autopublish                   1.0.1  Publish the entire database to all clients
insecure                      1.0.1  Allow all database writes by default
iron:router                   1.0.0-pre4  Routing specifically designed for M...
j4507:datatables-bootstrap-3  0.2.3  DataTable - jQuery plugin for sortable, ...
jquery                        1.0.1  Manipulate the DOM using CSS selectors
maazalik:highcharts           0.2.2  HighCharts for Meteor, with an easy to u...
meteor-platform               1.1.2  Include a standard set of Meteor package...
mizzao:bootstrap-3            3.2.0_1  HTML, CSS, and JS framework for develo...
mizzao:jquery-ui              1.11.0  Simple lightweight pull-in for jQuery U..


-----------------------------------
To add CSV data to the database:

Run: ./mongoimport -h localhost:3001 --db meteor --collection Residents --type csv --file [filename].csv --headerline
