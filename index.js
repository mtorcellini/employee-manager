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
      removeEmployee();
      break;
    case 'Update employee role':
      updateRole();
      break;
    case 'Update employee manager':
      updateManager();
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

async function getManagers() {

    // select all employees who don't have a manager
    const managers = await connection.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS name from employee WHERE manager_id IS NULL`);

    // get an array of manager objects with name and id properties
    // set to name and value for use with inquirer
    const managersArray = managers.map(manager => {
      return {name : manager.name, value : manager.id};
    })

    return managersArray;

}

async function getAllByMan() {

  const managerArray = await getManagers();

  const response = await inquirer.prompt([
    {
      name : 'selectedManId',
      type: 'list',
      message : 'Select manager',
      choices : managerArray
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

  const managerArray = await getManagers();

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
      choices : [...managerArray, {name : 'This employee is a manager', value : null}]
    }
  ])

  // add new employee to database

  const queryString = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`;

  await connection.query(queryString, [newEmployee.firstName, newEmployee.lastName, newEmployee.roleID, newEmployee.manager]);

  initialPrompts();

}

async function getEmployeeNames() {

  // get list of employees
  const response = await connection.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee;`);
  const employeeArray = response.map(employee => {
    return {name : employee.name, value : employee.id};
  })

  return employeeArray;
}

async function removeEmployee() {

  const employeeArray = await getEmployeeNames();

  const employeeToRemove = await inquirer.prompt([
    {
      name : 'id',
      message : 'Choose an employee to REMOVE: ',
      type : 'list',
      choices : employeeArray
    }
  ])

  const idToRemove = employeeToRemove.id;

  await connection.query(`DELETE from employee WHERE id = ?`, idToRemove);

  initialPrompts();

}

async function updateRole() {

  const employeeArray = await getEmployeeNames();

  const empToUpdate = await inquirer.prompt([
    {
      name : 'employeeId',
      message : 'Choose an employee to update: ',
      type : 'list',
      choices : employeeArray
    }
  ])

  // get role list
  const roles = await connection.query(`SELECT id, title FROM role;`);
  const roleArray = roles.map(role => {
    return {name : role.title, value : role.id};
  })

  const newRole = await inquirer.prompt([
    {
      name : 'newRoleId',
      message : `Choose a new role for employee ${empToUpdate.employeeId}: `,
      type : 'list',
      choices : roleArray
    }
  ])

  // update role
  await connection.query(
    `UPDATE employee SET role_id = ? WHERE id = ?;`, 
    [newRole.newRoleId, empToUpdate.employeeId]
  );

  initialPrompts();
}

async function updateManager() {

  //get employees
  const employeeArray = await getEmployeeNames();

  //get managers
  const managerArray = await getManagers();

  const response = await inquirer.prompt([
    {
      name : 'selectedEmployee',
      message : `Which employee's manager would you like to update? `,
      type : 'list',
      choices : employeeArray
    },
    {
      name : 'selectedManager',
      message : 'Which manager are you assigning? ',
      type : 'list',
      choices : managerArray
    }
  ])

  await connection.query(`UPDATE employee SET manager_id = ? WHERE id = ?`, [response.selectedManager, response.selectedEmployee]);

  initialPrompts();


}


initialPrompts();