// Load packages needed for the application
const inquirer = require('inquirer');
const queries = require('./db/queries.js');
const pool = require('./db/dbConnection.js');

// Create an array of questions for user input
const questions = [
    {
        type: 'list',
        name: 'input',
        message: "What would you like to do?",
        choices: ['View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'],
    },
];

// Create a function to initialize app
function init() {
    inquirer
        .prompt(questions)
        .then((answers) => {
            switch (answers.input) {
                case 'View all departments':    
                    queries.viewAllDepartments();
                    break;
                case 'View all roles':
                    queries.viewAllRoles();
                    break;
                case 'View all employees':
                    queries.viewAllEmployees();
                    break;
                case 'Add a department':
                    inquirer
                        .prompt({
                            type: 'input',
                            name: 'department',
                            message: "What is the name of the department?",
                                validate(department) {
                                    if (department.trim() === '') {
                                        return 'Please provide a department name.';
                                    } else {
                                        return true;
                                    }
                                },                        
                            })
                        .then((input) => {
                            if (input.department) {
                                queries.addDepartment(input.department);
                            } 
                    })                    
                    break;
                case 'Add a role':
                    pool.query(`SELECT id, name AS department FROM departments`, (err, res) => {
                        const departments = res.rows.map(item => item.department);
                        const departmentsRes = res.rows;
                        if (!err) {                            
                            inquirer
                                .prompt([
                                    {
                                        type: 'input',
                                        name: 'role',
                                        message: "What is the name of the role?",
                                            validate(role) {
                                                if (role.trim() === '') {
                                                    return 'Please provide a role.';
                                                } else {
                                                    return true;
                                                }
                                            },                        
                                    },
                                    {
                                        type: 'input',
                                        name: 'salary',
                                        message: "What is the salary of the role?",
                                            validate(salary) {
                                                if (salary.trim() === '') {
                                                    return 'Please provide a salary.';
                                                } else {
                                                    return true;
                                                }
                                            },                        
                                    },
                                    {
                                        type: 'list',
                                        name: 'department',
                                        message: "Which department does this role belong to?",
                                        choices: departments,                     
                                    },
                                ])
                                .then((input) => {
                                    if (input.role && input.salary && input.department) {
                                        let department_id = null;
                                                departmentsRes.forEach(item => {                                                    
                                                    if (item.department === input.department) {
                                                        department_id = item.id; 
                                                        return department_id;
                                                    }
                                                    else {
                                                        return department_id;                                                        
                                                    }
                                                });
                                        queries.addRole(input.role, input.salary, department_id);
                                    } 
                            })                           
                        } else {
                            console.log('error: ', err.message);
                        }
                    });
                    break;
                case 'Add an employee':
                    pool.query(`SELECT id, title AS role FROM roles`, (err, res) => {
                        if (!err) {
                            const roles = res.rows.map(item => item.role);
                            const rolesRes = res.rows;

                            pool.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS manager FROM employees WHERE manager_id IS NULL`, (err, res) => {
                                const managers = res.rows.map(item => item.manager); 
                                managers.push('None');
                                const managersRes = res.rows;                                
                                if (!err) {
                                    inquirer
                                        .prompt([
                                            {
                                                type: 'input',
                                                name: 'firstname',
                                                message: "What is the employee's first name?",
                                                validate(firstname) {
                                                    if (firstname.trim() === '') {
                                                        return 'Please provide a first name.';
                                                    } else {
                                                        return true;
                                                    }
                                                },
                                            },
                                            {
                                                type: 'input',
                                                name: 'lastname',
                                                message: "What is the employee's last name?",
                                                validate(lastname) {
                                                    if (lastname.trim() === '') {
                                                        return 'Please provide a last name.';
                                                    } else {
                                                        return true;
                                                    }
                                                },
                                            },
                                            {
                                                type: 'list',
                                                name: 'role',
                                                message: "What is the employee's role?",
                                                choices: roles,
                                            },
                                            {
                                                type: 'list',
                                                name: 'manager',
                                                message: "Who is the employee's manager?",
                                                choices: managers,
                                            },
                                        ])
                                        .then((input) => {
                                            if (input.firstname && input.lastname && input.role && input.manager) {
                                                let manager_id = null;
                                                managersRes.forEach(item => {                                                    
                                                    if (item.manager === input.manager) {
                                                        manager_id = item.id; 
                                                        return manager_id;
                                                    }
                                                    else {
                                                        return manager_id;                                                        
                                                    }
                                                });

                                                let role_id = null;
                                                rolesRes.forEach(item => {                                                      
                                                    if (item.role === input.role) {
                                                        role_id = item.id; 
                                                        return role_id;
                                                    }
                                                    else {
                                                        return role_id;                                                        
                                                    }
                                                });
                                                queries.addEmployee(input.firstname, input.lastname, role_id, manager_id);
                                            }
                                        })
                                } else {
                                    console.log('error: ', err.message);
                                }
                            });
                        } else {
                            console.log('error: ', err.message);
                        }     
                    });
                    break;
                case 'Update an employee role':                    
                    pool.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS employee FROM employees`, (err, res) => {
                        if (!err) {
                            const employees = res.rows.map(item => item.employee);
                            const employeesRes = res.rows;

                            pool.query(`SELECT id, title AS role FROM roles`, (err, res) => {
                                const roles = res.rows.map(item => item.role);
                                const rolesRes = res.rows;          
                                if (!err) {
                                    inquirer
                                        .prompt([
                                            {
                                                type: 'list',
                                                name: 'employee',
                                                message: "Which employee's role fo you want to update?",
                                                choices: employees,                     
                                            },
                                            {
                                                type: 'list',
                                                name: 'role',
                                                message: "Which role do you want to assign the selected employee?",
                                                choices: roles,                     
                                            },
                                        ])
                                        .then((input) => {
                                            if (input.employee && input.role) {
                                                let employee_id = null;
                                                employeesRes.forEach(item => {                                                    
                                                    if (item.employee === input.employee) {
                                                        employee_id = item.id;
                                                        return employee_id;
                                                    }
                                                });

                                                let role_id = null;
                                                rolesRes.forEach(item => {                                                      
                                                    if (item.role === input.role) {
                                                        role_id = item.id; 
                                                        return role_id;
                                                    }
                                                });
                                                queries.updateEmployeeRole(employee_id, role_id);
                                            }
                                        })
                                } else {
                                    console.log('error: ', err.message);
                                }
                            });
                        } else {
                            console.log('error: ', err.message);
                        }     
                    });

                    break;
                case 'Exit':
                    queries.exit();
                    break;
            }  
        })
        .catch((err) => {
            if(err)throw err;
        });
}


module.exports.init = init;