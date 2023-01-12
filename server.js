const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const mysql = require('mysql2');
require('console.table');

const db = mysql.createConnection({
    user: "root",
    database: "employee_db",
});

const selectNameAndValue = (table, name, value) => {
    return db.promise().query('SELECT ?? AS name, ?? AS value FROM ??', [name, value, table]);
};

const selectEmployeeNames = (value) => {
    return db.promise().query(`SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS name, ?? AS value FROM employee`, value);
};

const updateEmployeeInfo = (roleId, employeeId) => {
    return db.promise().query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId]);
};

const selectAllEmployeeInfo = async () => {
    const query = `
SELECT
  employee.id,
  employee.first_name,
  employee.last_name,
  role.title,
  role.salary,
  department.name AS department,
  CONCAT(
    manager.first_name,
    ' ',
    manager.last_name
  ) AS manager
FROM employee
JOIN role
ON employee.role_id = role.id
LEFT JOIN employee AS manager
ON employee.manager_id = manager.id
JOIN department
ON role.department_id = department.id
    `
    const [allEmployees] = await db.promise().query(query);
    console.table(allEmployees);
    init();
};

const showAllDepartments = () => {
    db.query('SELECT * FROM department', (err, departments) => {
        console.table(departments);
        init();
    });
};

const showAllRoles = () => {
    db.query('SELECT * FROM role', (err, roles) => {
        console.table(roles);
        init();
    });
};

const addDepartment = () => {
    prompt({
        type: 'input',
        message: 'What is the name of the department?',
        name: 'department',
    })
    .then((answer) => {
        db.query(`INSERT INTO department (name) VALUES (?)`, [answer.department], (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log(`Added ${answer.department} to the database`);
                init();
            }
        })
    });
};

const addRole = async () => {
    const [departments] = await selectNameAndValue('department', 'name', 'id');
    prompt([
        {
            type: 'input',
            message: 'What is the name of the role?',
            name: 'role',
        },
        {
            type: 'input',
            message: 'What is the salary of the role?',
            name: 'salary',
        },
        {
            type: 'rawlist',
            message: 'What department does this role belong to?',
            choices: departments,
            name: 'department',
        },
    ])
    .then((answer) => {
        db.query(`INSERT INTO role (title, salary, department_id) VALUES (?)`, [[answer.role, answer.salary, answer.department]], (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log(`Added ${answer.role} to the database`);
                init();
            }
        })
    });
};

const addEmployee = async () => {
    const [roles] = await selectNameAndValue('role', 'title', 'id');
    const [managers] = await selectEmployeeNames('id');
    prompt([
        {
            type: 'input',
            message: 'What is the employee\'s first name?',
            name: 'firstName',
        },
        {
            type: 'input',
            message: 'What is the employee\'s last name?',
            name: 'lastName',
        },
        {
            type: 'rawlist',
            message: 'What is the employee\'s role?',
            choices: roles,
            name: 'role',
        },
        {
            type: 'rawlist',
            message: 'Who is the employee\'s manager?',
            choices: managers,
            name: 'manager',
        },
    ])
    .then((answer) => {
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?)`, [[answer.firstName, answer.lastName, answer.role, answer.manager]], (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log(`Added ${answer.firstName} ${answer.lastName} to the database`);
                init();
            }
        })
    });
};

const updateEmployee = async () => {
    const [roles] = await selectNameAndValue('role', 'title', 'id');
    const [employees] = await selectEmployeeNames('id');
    prompt([
        {
            type: 'rawlist',
            message: 'Which employee\'s role would you like to update?',
            choices: employees,
            name: 'employee',
        },
        {
            type: 'rawlist',
            message: 'Which role would you like to assign to the selected employee?',
            choices: roles,
            name: 'role',
        },
    ])
    .then((answer) => {
        updateEmployeeInfo(answer.role, answer.employee);
        console.log(`Updated role!`);
        init();
    });
};

const chooseOption = (type) => {
    switch(type) {
        case 'VIEW ALL EMPLOYEES': {
            selectAllEmployeeInfo();
            break;
        }
        case 'VIEW ALL DEPARTMENTS': {
            showAllDepartments();
            break;
        }
        case 'VIEW ALL ROLES': {
            showAllRoles();
            break;
        }
        case 'ADD A DEPARTMENT': {
            addDepartment();
            break;
        }
        case 'ADD A ROLE': {
            addRole();
            break;
        }
        case 'ADD AN EMPLOYEE': {
            addEmployee();
            break;
        }
        case 'UPDATE AN EMPLOYEE ROLE': {
            updateEmployee();
            break;
        }
        case 'Exit': {
            process.exit(0);
        }
    }
};

const init = () => {
    prompt({
        type: 'rawlist',
        message: 'What would you like to do?',
        choices: [
            'VIEW ALL EMPLOYEES',
            'VIEW ALL DEPARTMENTS',
            'VIEW ALL ROLES',
            'ADD A DEPARTMENT',
            'ADD A ROLE',
            'ADD AN EMPLOYEE',
            'UPDATE AN EMPLOYEE ROLE',
            'EXIT',
        ],
        name: 'type',
    })
    .then((answer) => {
        chooseOption(answer.type);
    });
};

init();

