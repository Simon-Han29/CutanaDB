const {Client} = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'CutanaDB',
    password: 'fishanator29',
    port: 5432,
});

client.connect();

module.exports = client;