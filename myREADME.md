# Stuart's NC-games API

Link to hosted version: 
## https://stu-nc-games.herokuapp.com/

---

### This project has built an API to interact with a PSQL database via node-postgres.
### The database contains information about board games and other associated information such as reviews, categories and comments.
### Using the hosted version above you can use several endpoints to access different data from the database.

---

## Setup instructions
- Clone the repository from github using: ``` git clone https://github.com/StuartJauncey/nc_games.git```
- Install dependencies using: ``` npm install```
- Seed the local database by running the command ```npm run seed-dbs```
- You can run the tests by using ```npm run test```

## Create ```.env``` files to link to the database
- Create two new files called ```.env.test``` and ```.env.development```
- In the .env.test file add the line ```PGDATABASE=nc_games_test```
- In the .env.development file add the line ```PGDATABASE=nc_games```

## Minimum versions required
- ```node.js``` v14.17.6
- ```postgres``` v13.4