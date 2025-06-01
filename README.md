# Pickems
**This is the active branch for the project for the 2025 T2 Oceanic Prodigies/ARAM tournament**
Note that as Firebase offers Backend-As-A-Service (BaaS), you will only need to host the frontend from this repo whilst having a firebase account.

For T2 we will be implementing crystal ball whilst cleaning up the repository. Please contact STBAccuracy on discord for specifics on the db and project.

To help with the project please refer to the todos at the bottom for current progress and any git issues on the repository.

# How to run the frontend locally
1) To run it on your own machine make a .env file in the root directory with the following
``` js
  VITE_FIREBASE_APIKEY = ""
  VITE_FIREBASE_AUTH_DOMAIN = ""
  VITE_FIREBASE_PROJECT_ID = ""
  VITE_FIREBASE_STORAGE_BUCKET = ""
  VITE_FIREBASE_MESSAGE_SENDER_ID = "" 
  VITE_FIREBASE_APP_ID = ""
  VITE_FIREBASE_MEASUREMENT_ID = ""
```
2) Make sure that you have firebase set up with a firestore database with rules allowing reads and writes.
3) Run ```npm i``` to download all relevant libraries.

## Todos
Authentication (user)
- [X] Email restrict accounts to "edu.au" accounts.
- [ ] Check to see if the name has already been used (we have email check but not username)

Database
- [X] Set up database (with how data is stored)
- [ ] Configure read/write perms (will need to be adjusted for crystal ball)
- [ ] Create efficient system to store crystal ball (champions, numeric values, teams, players, ...)

Storage
- [ ] Find easy way to cache lots of images for crystal ball + pickems (images stored on google bucket take a bit to load, perhaps see if we can use league wiki champion images if there is not legal copyright issues)

Pickem (admin)
- [ ] Create "types"/category of crystal ball pickems (e.g. create a pool of champions for certain pickems)
- [ ] Create a crystal ball pickem using one category (e.g. champions -> most picked/banned/kills)
- [ ] Create a simple UI to allow team to easily adjust crystal ball pickem between matches (e.g. add champion picks/kills)
- [ ] Create a simple button that allows team to revert pickem point allocation (e.g. during bracket pickems so we can avoid admin error)

Pickem (user)
- [ ] Allow user to easily pick each crystal ball pickems
- [ ] New tab for crystal ball and brackets (React Bootstrap Tabs are easy ways to do this)

UI work
- [ ] Pickem (concise and descriptive)
- [ ] Leaderboard (cleaner akin to league 2024 pickems or CR leaderboard)
- [ ] Home page (content + UI)
- [ ] Colour scheme (dark mode !!!)

Codebase work
- [ ] Organise CSS on all pages to separate CSS files for each page
- [ ] Move components and hooks to dedicated files from page files and clean it up
- [ ] Correct CSS for mobile usage
