const connection = require('./connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

const initialPrompts = async () => {

  // set up first prompt - what do you want to do?
  const res = await inquirer.prompt([
    {
      name : 'action',
      type : 'list',
      message : 'What would you like to do?',
      choices : [
        'View all employees',
        'View all employees by department',
        'View all employees by manager',
        'Add employee',
        'Remove employee',
        'Update employee role',
        'Update employee manager',
      ]
    },
  ])

  // switch for user action selection
  switch (res.action) {
    case 'View all employees' :
      viewAll();
      break;
    case 'View all employees by department':
      getAllByDept();
      break;
    case 'View all employees by manager':
      getAllByMan();
      break;
    case 'Add employee':
      addEmployee();
      break;
    case 'Remove employee':
      break;
    case 'Update employee role':
      break;
    case 'Update employee manager':
      break;
  }

}

// helper function for viewAll, can probably be put into viewAll
function getAll() {
  const queryString = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee
    LEFT JOIN role
    ON employee.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id
    LEFT JOIN employee manager
    ON employee.manager_id = manager.id`
  return connection.query(queryString);
}

async function viewAll() {
  const response = await getAll();
  console.table(response);
  initialPrompts();
}

async function getAllByDept() {
  const departments = await connection.query(`SELECT * from department`);

  // get array of department names
  departmentsArray = departments.map(dept => dept.name);

  const response = await inquirer.prompt([
    {
      name : 'department',
      message : 'Choose a department',
      type: 'list',
      choices : departmentsArray
    }
  ]);

  let queryString = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary FROM employee
    LEFT JOIN role
    ON employee.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id
    WHERE department.name = ?;`

  // query employees belonging to selected department
  const employees = await connection.query(queryString, response.department);
  console.table(employees);

  initialPrompts();

}

async function getAllByMan() {

  // select all employees who don't have a manager
  const managers = await connection.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS name from employee WHERE manager_id IS NULL`);

  // get an array of manager objects with name and id properties
  // set to name and value for use with inquirer
  const managersArray = managers.map(manager => {
    return {name : manager.name, value : manager.id};
  })

  const response = await inquirer.prompt([
    {
      name : 'selectedManId',
      type: 'list',
      message : 'Select manager',
      choices : managersArray
    }
  ])

  // get employees whose manager_id matches the prompt's returned value
  const employees = await connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department from employee 
    LEFT JOIN role 
    ON employee.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id
    WHERE manager_id = ?;`,
    response.selectedManId);

  console.table(employees);

  initialPrompts();

}

async function addEmployee() {

  // get list of roles
  const roles = await connection.query(`SELECT id, title from role`);
  const roleArray = roles.map(role => {
    return {name : role.title, value : role.id};
  });

  // get list of managers (THIS NEEDS TO BE DRIED)
  // select all employees who don't have a manager
  const managers = await connection.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS name from employee WHERE manager_id IS NULL`);

  // get an array of manager objects with name and id properties
  // set to name and value for use with inquirer
  const managerArray = managers.map(manager => {
    return {name : manager.name, value : manager.id};
  })


  // get details for new employee
  const newEmployee = await inquirer.prompt([
    {
      name : 'firstName',
      message : 'First name :'
    },
    {
      name : 'lastName',
      message : 'Last name :',
    },
    {
      name : 'roleID',
      message : 'Select a role for the employee',
      type : 'list',
      choices : roleArray
    },
    {
      name : 'manager',
      message : 'Select a manager: ',
      type : 'list',
      choices : managerArray
    }
  ])

  // add new employee to database

  const queryString = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`;

  await connection.query(queryString, [newEmployee.firstName, newEmployee.lastName, newEmployee.roleID, newEmployee.manager]);

  initialPrompts();

}




initialPrompts();