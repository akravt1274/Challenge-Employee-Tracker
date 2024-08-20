const app = require('../app.js');

// Create a Connection Pool
const { Pool } = require('pg');

// Connect to database
const pool = new Pool(
    {
        user: 'postgres',
        password: 'admin',
        host: 'localhost',
        database: 'employee_tracker'
    },
    console.log('Connected to the employee_tracker database.')
)

pool.connect((err) => {
    if (err) throw err;
    app.init();    
});

module.exports = pool;