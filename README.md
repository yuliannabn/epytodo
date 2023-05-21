# epytodo

Epitech project that consists in creating a REST API that handles CRUD operations, in this case, for a to-do list application.

## ROUTES:
```
| route               | method | protected | description            |
| ------------------- | ------ | --------- | ---------------------- |
| /register           | POST   |    no     | register a new user    |
| /login              | POST   |    no     | connect a user         |
| /user               | GET    |    yes    | view all user info     |
| /user/todos         | GET    |    yes    | view all user tasks    |
| /users/:id or :email| GET    |    yes    | view user information  |
| /users/:id          | PUT    |    yes    | update user information|
| /users/:id          | DELETE |    yes    | delete user            |
| /todos              | GET    |    yes    | view all the todos     |
| /todos/:id          | GET    |    yes    | view the todo          |
| /todos              | POST   |    yes    | create a todo          |
| /todos/:id          | PUT    |    yes    | update a todo          |
| /todos/:id          | DELETE |    yes    | delete a todo          |
```
To access the protected routes, you will need to send the login's response token.

## RECOMMENDED STRUCTURE:

```
| - - .env
| - - package.json
`-- src
  | - - config
  |     `-- db.js
  | - - index.js
  | - - middleware
  |     | - - auth.js
  |     `-- notFound.js
  `-- routes
    | - - auth
    |	   `-- auth.js
    | - - todos
    |     | - - todos.js
    |     `-- todos.query.js
    `-- user
        | - - user.js
        `-- user.query.js
```

## REQUIREMENTS

> - nodejs
> - MYSQL / MariaDB

### To install dependencies:

> npm install

### To import the database:

> cat epytodo.sql | mysql -u root -p

### Run with

> npm start
