import fs from 'fs';

const DATABASE_FILE = '/database.json';

let data = {
  users: [],
  entities: [],
  pickems: [],
};

// Use getData() to access the data
export function getData() {
  return data;
}

// Use loadData() on server bootup to convert any existing database files into data
export function loadData() {
  if (fs.existsSync(__dirname + DATABASE_FILE)) {
    const dataString = String(fs.readFileSync(__dirname + DATABASE_FILE));
    data = JSON.parse(dataString);
  }
  return {};
}

// Use storeData() after each route to store any changes to a permanent storage databse
export function storeData() {
  fs.writeFileSync(__dirname + DATABASE_FILE, JSON.stringify(data));
  return {};
}
