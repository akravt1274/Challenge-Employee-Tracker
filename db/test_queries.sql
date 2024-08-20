-- To test queries used in the app

SELECT roles.id, roles.title AS "job title", departments.name, roles.salary
FROM roles
INNER JOIN departments ON department_id = departments.id;

SELECT
    employees.id,
    first_name AS "first name",
    last_name AS "last name",
    roles.title AS "job title",
    roles.id AS "job id",
    departments.name AS department,
    roles.salary,
    (
        SELECT CONCAT(
                employees.first_name, ' ', employees.last_name
            )
        FROM employees
        WHERE
            manager_id = employees.id
    ) AS manager
FROM
    employees
    INNER JOIN roles ON employees.role_id = roles.id
    INNER JOIN departments ON roles.department_id = departments.id;

DELETE FROM departments WHERE departments.name = ''

DELETE FROM roles WHERE title = 'Purchasing'

SELECT id, name AS department FROM departments WHERE departments.name = 'HR'

SELECT * FROM employees;

SELECT * FROM roles;

SELECT manager_id, CONCAT(first_name, ' ', last_name) AS manager FROM employees;

UPDATE employees
SET manager_id = 7 WHERE id = 8

SELECT
    employees.id,
    CONCAT( employees.first_name, ' ', employees.last_name ) AS employee,
    roles.title AS role,
    departments.name AS department,
    roles.salary,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON departments.id = roles.department_id
    LEFT JOIN employees manager ON manager.id = employees.manager_id
    ORDER BY id ASC;


SELECT manager_id, CONCAT(first_name, ' ', last_name) AS manager
FROM employees

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES (Anastasia, Kravtsov, 2, null);

UPDATE employees SET role_id = 7 WHERE id = 8;


