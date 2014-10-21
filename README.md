browninternal
=============

To use these files:

1. Install meteor
2. Create a new project called "browninternal"
3. Delete the auto-generated files in the project folder and copy these files into the folder
4. Add the packages "iron:router@1.0.0-pre4", "mizzao:bootstrap-3", "accounts-ui", and "accounts-github" with the command "meteor add [package name]"
5. Run meteor
6. Navigate to localhost:3000 to see the website

To add CSV data to the database:

Run: ./mongoimport -h localhost:3001 --db meteor --collection Residents --type csv --file data.csv --headerline
