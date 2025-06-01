# Pickems

This is an inactive branch of the pickems for PCSoc. We are currently working on the T2 version with crystal ball on the [2025T2/OP2](https://github.com/unswpcsoc/pickems/tree/2025T2/OP2) branch.

_Note this is the codebase for the T1 OP1/Megalan pickems, feel free  to take a look if you want!_

# How to run it
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
3) Use (npm install) to download all necessary modules/libraries.
