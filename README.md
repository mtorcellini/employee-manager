# Employee Manager System
## Description

A CLI solution for managing employees. Allows the user to add, remove, update and view employees by department or manager. Requires node, npm.

## Installation

1. Clone this repo.

2. Create a local database called `employee_manager_db` by running the `schema.sql` file. This will also seed the database with some example data.

3. Create a `.env` file with the following variables:

```
DB_HOST=localhost
DB_USER=[your SQL username]
DB_PW=[your SQL password]
```

4. Install dependencies by running `npm i`

## Usage

- Run `node index` to start the program.

- Follow the onscreen prompts.

![cli-screenshot](./cli-screenshot.png?raw=true)
