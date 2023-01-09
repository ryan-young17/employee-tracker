const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const mysql = require('mysql2');
require('console.table');

const db = mysql.createConnection({
    user: "root",
    database: "employee_db",
});

const chooseOption = (type) => {
    switch(type) {
        case 'VIEW ALL EMPLOYEES': {
            db.query('SELECT * FROM employee', (err, employees) => {
                console.table(employees);
                init();
            });
            break;
        }
        case 'VIEW ALL DEPARTMENTS': {
            db.query('SELECT * FROM department', (err, departments) => {
                console.table(departments);
                init();
            });
            break;
        }
        case 'VIEW ALL ROLES': {
            db.query('SELECT * FROM role', (err, roles) => {
                console.table(roles);
                init();
            });
            break;
        }
        case 'ADD A DEPARTMENT': {
            console.log('Will add a department');
            init();
            break;
        }
        case 'ADD A ROLE': {
            console.log('Will add a role');
            init();
            break;
        }
        case 'ADD AN EMPLOYEE': {
            console.log('Will add an employee');
            init();
            break;
        }
        case 'UPDATE AN EMPLOYEE ROLE': {
            console.log('Will update an employee role');
            init();
            break;
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
        ],
        name: 'type',
    })
    .then((answer) => {
        chooseOption(answer.type);
    });
};

init();

