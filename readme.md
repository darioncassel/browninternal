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

-accounts-base                 1.1.3  
-accounts-github               1.0.3  
-accounts-password             1.0.5  
-accounts-ui                   1.1.4  
-autopublish                   1.0.2  
-insecure                      1.0.2  
-iron:router                   1.0.6  
-j4507:datatables-bootstrap-3  0.2.3
-jquery                        1.0.2  
-kevohagan:sweetalert          0.3.2  
-maazalik:highcharts           0.2.3  
-meteor-platform               1.2.1  
-mizzao:bootboxjs              4.3.0  
-mizzao:bootstrap-3            3.3.1_1  
-mizzao:jquery-ui              1.11.2  
-mrt:bootstrap-3-timepicker    0.2.5  
-mrt:moment                    2.8.1  
-scmart:fullcalendar-2         2.0.2  


To add CSV data to the database:

Run: ./mongoimport -h localhost:3001 --db meteor --collection Residents --type csv --file [filename].csv --headerline
