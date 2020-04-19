# Authentication
Working Authentication example on a node server using Passport and MySQL

## How to Install

I have used MySQL here

#### Creating The database

Create the database and the user table using the following command
```bash
mysql> CREATE DATABASE auth_demo;
mysql> USE auth_demo;
mysql> CREATE TABLE users(username VARCHAR(50), salt VARCHAR(150), hash VARCHAR(150));
```
#### Cloning the repository and insatlling dependencies

To install this example on your computer- clone the repository and install
dependencies.
```bash
$ git clone https://github.com/lusar98/Authentication.git
$ cd Authentication
$ npm install
```
## Starting the server

```bash
$ node app.js
```
Open a web browser and navigate to [http://localhost:3000/](http://localhost:3000/).

##### `Note` Don't forget to change `database.js` file in `utils` directory, if required, to match your own database.