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

meteor-platform
autopublish
insecure
iron:router@1.0.0-pre4
accounts-ui
accounts-github
accounts-base
mizzao:bootstrap-3
jquery
j4507:datatables-bootstrap-3
mizzao:jquery-ui
maazalik:highcharts



To add CSV data to the database:

Run: ./mongoimport -h localhost:3001 --db meteor --collection Residents --type csv --file [filename].csv --headerline
