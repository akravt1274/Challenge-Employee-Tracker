const pool = require('./dbConnection.js');
const cTable = require('console.table'); 
const app = require('../app.js');

// Query database

function viewAllDepartments() {
    return pool.query(`SELECT id, name AS department FROM departments`, (err, res) => {
        if (!err) {
            console.log(``);
            console.table(res.rows);
            app.init();
        } else {
            console.log('error: ', err.message);
        }    
});
}

function viewAllRoles() {
    return pool.query(`SELECT roles.id, roles.title AS "job title", departments.name AS "department", roles.salary FROM roles
INNER JOIN departments ON department_id = departments.id`, (err, res) => {
        if (!err) {
            console.log(``);
            console.table(res.rows);
            app.init();
        } else {
            console.log('error: ', err.message);
        }    
});
}

function viewAllEmployees() {
    return pool.query(`SELECT employees.id,
    CONCAT(employees.first_name, ' ', employees.last_name ) AS employee,
    roles.title AS role,
    departments.name AS department,
    roles.salary,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON departments.id = roles.department_id
    LEFT JOIN employees manager ON manager.id = employees.manager_id
    ORDER BY id ASC`, (err, res) => {
        if (!err) {
            console.log(``);
            console.table(res.rows);
            app.init();
        } else {
            console.log('error: ', err.message);
        }    
});
}

function addDepartment(name) {
    return pool.query(`INSERT INTO departments (name) VALUES ($1)`, [name], (err, res) => {
        if (!err) {            
            console.log(`Added ${name} to the database`);
            app.init();
        } else {
            console.log('error: ', err.message);
        }
});
}

function addRole(title, salary, department_id) {
    return pool.query(`INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)`, [title, salary, department_id], (err, res) => {
                if (!err) {  
                    console.log(`Added ${title} to the database`);
                    app.init();                              
                } else {
                    console.log('error: ', err.message);
                }
        }); 
}


function addEmployee(firstname, lastname, role_id, manager_id) {
    return pool.query('SELECT id, name FROM departments', (err, res) => {
        if (!err) {
            pool.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [firstname, lastname, role_id, manager_id], (err, res) => {
                if (!err) {  
                    console.log(`Added ${firstname} ${lastname} to the database`);
                    app.init();                              
                } else {
                    console.log('error: ', err.message);
                }
        }); 
        } else {
            console.log('error: ', err.message);
        }    
});
}

function updateEmployeeRole(employee_id, role_id) {
    return pool.query('UPDATE employees SET role_id = $1 WHERE id = $2', [role_id, employee_id], (err, res) => {
        if (!err) {
            console.log(`The employee role is updated in the database`);
            app.init();  
        } else {
            console.log('error: ', err.message);
        }    
});
}

function exit() {
    console.log('Connection closed');
    return pool.end();
}

const queries = {
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
    exit
};
module.exports = queries;