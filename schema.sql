DROP DATABASE IF EXISTS employee_manager_db;
CREATE DATABASE employee_manager_db;
USE employee_manager_db;

CREATE TABLE employee (
  id INT AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  PRIMARY KEY (id)
);

CREATE TABLE department (
  id INT AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('Floofy', 'Cat', 2, null),
  ('Hambone', 'Cat', 1, null),
  ('Francis', 'Willibald', 6, 5),
  ('Brometheus', 'the Excellent', 4, 2),
  ('Charlie', 'Unicorn', 5, null),
  ('Arthur', 'King', 3, 2),
  ('Tappy', 'Turtle', 7, 1);

INSERT INTO department (name) VALUES 
  ('Sales'),
  ('Finance'),
  ('Department of Redundancy'),
  ('Engineering'),
  ('Legal');

INSERT INTO role (title, salary, department_id) VALUES
  ('Engineer I', 65000, 4),
  ('Engineer II', 89000, 4),
  ('Accountant', 70000, 2),
  ('Jar Opener', 42000, 3),
  ('Sales Lead', 60000, 1),
  ('Salesperson', 53000, 1),
  ('Lawyer', 63000, 5);

