browninternal
=============

## Easy setup

1. Install meteor
2. git clone this repo
3. Run meteor
4. Navigate to localhost:3000 to see the website

note: you will need the email account information to get the forgot password section working.
Seperate server/token.js file should document the account information so we keep passwords off this repo.
example server/token.js:
  `process.env.MAIL_URL="smtp://browncollegeuva%40gmail.com:********@smtp.gmail.com:587/";`

## Server side setup notes:

- Start it on the server side with `ROOT_URL=http://domain.com meteor`, or accounts reset emails will be wrong.

## Data

To add CSV data to the database:

Run: ./mongoimport -h localhost:3001 --db meteor --collection Residents --type csv --file [filename].csv --headerline

## Commit notes

- To commit a meteor project, please commit the stuff in .meteor that shows up, that'll take care of project management automatically
