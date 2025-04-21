---
layout: default
title: How to Interact with the MySQL Database (Dockerized)
nav_order: 2
nav_exclude: false
search_exclude: false
---
# **How to Interact with the MySQL Database (Dockerized)**

This guide outlines how to interact with the MySQL database in your Dockerized environment. It covers how the connection is managed, how CRUD operations are executed, and provides details on the code structure and flow for database operations.

## **1. Overview**

### **1.1 Docker Containers and Network Communication**

In this project, **all of our services run in Docker containers**, including the MySQL database, PhpMyAdmin, and the web application. Each service is isolated within its own container, and all containers need to be part of the same **Docker network** to communicate with each other.

- **Why Docker Containers**: Docker containers encapsulate the services in isolated environments, which makes them portable and ensures that the application runs consistently across different systems.
    
- **Communication Across Containers**: For the containers to communicate, such as for the web application to interact with the MySQL database, they must be on the same Docker network. This ensures that when the web app tries to access the MySQL database, it knows how to find the database container by its service name (`database` in your `docker-compose.yml` file). 

The Docker network allows these services to be aware of each other by their container names (e.g., `database` for MySQL, `phpmyadmin` for database management). This is crucial because each container runs in its own isolated environment, and without this network setup, they would not be able to talk to each other.
### **1.2 Purpose of This Documentation**

This documentation explains how to establish a connection with the MySQL database running in the Docker container, execute SQL queries, and manage CRUD operations. It will also describe how database connections are managed and how asynchronous operations are handled.

## **2. Prerequisites**

Before proceeding with database interaction, ensure the following:

- **Docker** and **Docker Compose** are installed on your machine.
    
- **MySQL Database** is running in a Docker container as defined in `docker-compose.yml`.
    
- The **.env file** contains the necessary environment variables for connecting to MySQL (such as passwords, user details, and database name).

---

## **3. Managing the MySQL Database Connection**

### **3.1 Establishing a Connection**

The connection to the MySQL database is managed through a function called **`openConnection()`**. This function uses the `mysql2` package to connect to the database and is the first step in any database operation.

- **`openConnection()`**: Establishes a connection to the database.
    
- **`closeConnection()`** or **`shutdownConnection()`**: Safely closes the connection after completing operations to release resources.

These functions are defined in the `connection.js` file, ensuring that every query or operation with the database is wrapped around a connection lifecycle.

```
const mysql = require('mysql2');  
function openConnection() {   
	const connection = mysql.createConnection({     
		host: 'localhost', // or 'database' if within Docker     
		user: process.env.DB_USER,     
		password: process.env.DB_PASSWORD,     
		database: process.env.DB_NAME   
	});  
		  
	return connection; 
}  
function closeConnection(connection) {   
	connection.end((err) => {     
		if (err) {       
			console.error('Error closing connection:', err.message);     
		} else {       
			console.log('Connection closed');     
		}   
	}); 
}
```



---

### **3.2 Passing the Connection Object**

- Initially, the plan was to use a **global connection variable**, but this has been changed for safer execution. Now, the **connection object is passed as a parameter** to every function that interacts with the database.
    
    This makes the code safer, as the connection is no longer shared globally, but instead, is explicitly passed between functions.

Example of passing the connection object:

```
async function getUserById(connection, userId) {   
	const query = 'SELECT * FROM users WHERE id = ?';   
	const [rows] = await connection.execute(query, [userId]);   
	return rows; // Return the fetched user data 
}
```

---

## **4. CRUD Operations**

### **4.1 Create (INSERT)**

To add new data to the database, we use the `INSERT` SQL query. The operation is asynchronous, so we use `await` to ensure the query completes before continuing with further operations.

Example in `userQueries.js`:

```
async function createUser(connection, name, email) {   
	const query = 'INSERT INTO users (name, email) VALUES (?, ?)';   
	await connection.execute(query, [name, email]);   
	console.log('User created'); 
}
```

### **4.2 Read (SELECT)**

The `SELECT` query is used to fetch data from the database. The results of the query are returned as a promise, which is handled asynchronously using `await`.

Example in `userQueries.js`:

```
async function getUserById(connection, userId) {   
	const query = 'SELECT * FROM users WHERE id = ?';   
	const [rows] = await connection.execute(query, [userId]);   
	return rows; // Return the user data 
}
```

### **4.3 Update (UPDATE)**

The `UPDATE` query modifies existing records in the database. We ensure that the database query is completed before continuing by using `await`.

Example in `userQueries.js`:

```
async function updateUserEmail(connection, userId, newEmail) {   
	const query = 'UPDATE users SET email = ? WHERE id = ?';   
	await connection.execute(query, [newEmail, userId]);   
	console.log('User email updated'); 
}
```

### **4.4 Delete (DELETE)**

The `DELETE` query removes data from the database. As with other queries, this operation is asynchronous.

Example in `userQueries.js`:

```
async function deleteUser(connection, userId) {   
	const query = 'DELETE FROM users WHERE id = ?';   
	await connection.execute(query, [userId]);   
	console.log('User deleted'); 
}
```

---

## **5. Asynchronous Query Handling**

Since all database interactions are asynchronous, we use `await` or `.then()` to ensure the operations are completed before moving to the next steps. For instance:

`const results = await connection.execute(query, [userId]);`

This ensures that the database query completes before returning the result, preventing issues like unhandled promises.

---

## **6. File Structure Overview**

The database interaction code is structured across several files to keep it modular and organized:

- **`connection.js`**: Contains the functions for opening and closing the database connection.
    
- **`construction.js`**: Contains functions for constructing the database tables (e.g., `CREATE TABLE` queries).
    
- **`siteQueries.js`**: Contains SQL queries related to sites (e.g., `INSERT`, `SELECT`, `UPDATE`, `DELETE` for sites).
    
- **`userQueries.js`**: Contains SQL queries related to users (e.g., CRUD operations for user data).
    
- **`utility.js`**: Contains helper functions that support the queries (e.g., formatting query results, error handling).
    

---

## **7. Error Handling**

Since all database operations are asynchronous, it is important to handle errors appropriately. Here's an example of how errors are caught:

```
try {   
	const results = await connection.execute(query, [userId]); 
} catch (err) {   
	console.error('Error executing query:', err.message); 
}
```

This ensures that any errors during the database query are caught and logged properly, preventing crashes.

---

## **8. Closing the Connection**

Once all database interactions are complete, the connection should be closed to release resources.

Example:

```
function closeConnection(connection) {   
	connection.end((err) => {     
		if (err) {       
			console.error('Error closing connection:', err.message);     
		} else {       
			console.log('Connection closed');     
		}   
	}); 
}
```

---

## **9. Security Considerations**

- **SQL Injection**: Use parameterized queries (e.g., `?`) instead of concatenating user inputs directly into SQL statements to prevent SQL injection attacks.
    
- **Password Management**: Store sensitive information such as database credentials securely in the `.env` file and avoid hardcoding passwords in source files.
    

---

## **10. Additional Resources**

- **MySQL Documentation**: [https://dev.mysql.com/doc/](https://dev.mysql.com/doc/)
    
- **mysql2 Package Documentation**: [https://www.npmjs.com/package/mysql2](https://www.npmjs.com/package/mysql2)
    
- **Node.js Async/Await Documentation**: [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
    

---

### **Summary**

This guide explains how to manage the MySQL database connection and execute CRUD operations asynchronously using the `mysql2` package. The connection is passed explicitly to each function, ensuring a clean and safe approach to database interaction. All operations are designed to be asynchronous, allowing for non-blocking execution and efficient handling of database commands.