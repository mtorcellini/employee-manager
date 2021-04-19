const connection = require('./connection');
const inquirer = require('inquirer');

connection.connect((err) => {
  if (err) throw err;
  console.log(`Connected to mysql server at ID ${connection.threadId}`);
})


const initialPrompt = async () => {
  const response = await inquirer.prompt([
    {
      name : 'todo',
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
  ]);
  return response;
}

const init = async () => {
  const initialResponse = await initialPrompt();
  
}