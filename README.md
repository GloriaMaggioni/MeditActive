# MeditActive — REST API

**MeditActive** is the backend of a wellness app that offers users a catalog of **predefined goals** to improve their lifestyle.
 
This repository contains a **REST API** built with **Node.js + Express** and a **MySQL** database. It lets you:
 
- manage **users** (full CRUD);
- read the **goals catalog** (`goals`);
- manage each user's **time intervals** (start date and end date), with **filters** by goal and by date;
- link an interval to one or more goals through a **junction table** (`tabellaPonte`) and update the link's **status** (`active`, `finished`, `deleted`, `suspended`).
A goal in the catalog is never deleted: when a user stops following it, the status of the link in the junction table is updated instead (*soft delete*).
 
> Note: table, route and field names are in Italian/English as in the original code (e.g. `intervalli` = intervals, `data_inizio` = start date, `data_fine` = end date, `tabellaPonte` = junction table).
 
### Tech stack
 
| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org/) | JavaScript runtime (project uses **ES Modules**, `"type": "module"`) |
| [Express 5](https://expressjs.com/) | HTTP server and routing |
| [MySQL](https://www.mysql.com/) | Relational database (schema designed in MySQL Workbench) |
| [mysql2](https://github.com/sidorares/node-mysql2) | MySQL driver, used with a **connection pool** and **Promises** (`pool.execute` with parameterized queries) |
| [dotenv](https://github.com/motdotla/dotenv) | Loads environment variables from the `.env` file |
| [nodemon](https://nodemon.io/) | Auto-restarts the server during development |
| [Postman](https://www.postman.com/) | Manual endpoint testing |
 
### Project structure
 
```
MeditActive/
├── config/
│   └── db.js                         # MySQL connection pool (reads variables from .env)
├── controllers/                      # Logic: database queries and HTTP responses
│   ├── utentsControllers.js
│   ├── goalsControllers.js
│   ├── intervalliControllers.js
│   └── tabellaPonteControllers.js
├── routes/                           # Routes only, wired to the controllers
│   ├── utents.js
│   ├── goals.js
│   ├── intervalli.js
│   └── tabellaPonte.js
├── index.js                          # Entry point: Express, express.json() middleware and route mounting
├── migration.sql                     # Script that creates the database and tables
├── package.json
└── .gitignore
```
 
The project separates **routes** (which URL and which HTTP method) from **controllers** (what happens when that route is called).
 
### Database
 
Database: `meditActiveDB` — 4 tables.
 
| Table | Content |
|---|---|
| `utents` | Users: `id`, `name`, `surname`, `email` |
| `goals` | Catalog of predefined goals: `id`, `name` |
| `intervalli` | Time intervals: `id`, `data_inizio`, `data_fine`, `utent_id` (FK → `utents.id`) |
| `tabellaPonte` | Junction table (many-to-many relationship between intervals and goals): `intervallo_id` (FK → `intervalli.id`), `goal_id` (FK → `goals.id`), `status`. **Composite primary key** (`intervallo_id`, `goal_id`) |
 
The `status` column of `tabellaPonte` is defined as:
 
```sql
status ENUM('active','finished','deleted','suspended') NOT NULL DEFAULT 'active'
```
 
Database schema:
<img width="1785" height="2451" alt="database-schema-en" src="https://github.com/user-attachments/assets/27f749db-b7de-4ade-b2e0-28411fa99307" />

 
### Installation and setup
 
**Prerequisites:** Node.js, npm and a running MySQL server.
 
1. **Clone the repository**
```bash
   git clone https://github.com/GloriaMaggioni/MeditActive.git
   cd MeditActive
```
 
2. **Install dependencies**
```bash
   npm install
```
 
3. **Create the database** by running `migration.sql` (for example from MySQL Workbench): the script creates the `meditActiveDB` database and all tables, including the junction table's `status` column.
4. **Insert the catalog goals.** After the migration the `goals` table is empty and the API has no endpoint to create goals (the catalog is predefined), so they must be inserted directly into the database. This step is required: without goals, `GET /goals` returns an empty list and `POST /tabellaPonte` fails, because `goal_id` must reference an existing goal (foreign key).
```sql
   INSERT INTO goals (name) VALUES ('Goal name 1'), ('Goal name 2');
```
 
5. **Create a `.env` file** in the project root with your database settings:
```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=meditActiveDB
```
 
   The `.env` file is excluded from Git via `.gitignore`.
 
6. **Start the server in development mode**
```bash
   npm run dev
```
 
   The server listens on **http://localhost:3000**.
 
### API endpoints
 
All requests with a body use **JSON** (`Content-Type: application/json`). Dates use the MySQL `DATE` format: `YYYY-MM-DD`.
On a server or database error, every endpoint responds with **500**.
 
#### 👤 Users — `/utents`
 
| Method | Endpoint | Body | Responses |
|---|---|---|---|
| `GET` | `/utents` | — | `200` list of all users |
| `GET` | `/utents/:id` | — | `200` user · `404` user not found |
| `POST` | `/utents` | `name`, `surname`, `email` (all required) | `201` created user with its `id` · `400` missing data |
| `PUT` | `/utents/:id` | `name`, `surname`, `email` (all required) | `200` user updated · `400` incomplete data · `404` user not found |
| `PATCH` | `/utents/:id` | at least one of `name`, `surname`, `email` | `200` partial update · `400` no valid field · `404` user not found |
| `DELETE` | `/utents/:id` | — | `200` user deleted · `404` user not found |
 
`PATCH` builds the query **dynamically**: it only updates the fields present in the body.
 
#### 🎯 Goals — `/goals`
 
| Method | Endpoint | Responses |
|---|---|---|
| `GET` | `/goals` | `200` full goals catalog |
| `GET` | `/goals/:id` | `200` goal · `404` goal not found |
 
#### 📅 Intervals — `/intervalli`
 
| Method | Endpoint | Body | Responses |
|---|---|---|---|
| `GET` | `/intervalli` | — (optional query-string filters, see below) | `200` list of intervals |
| `GET` | `/intervalli/:id` | — | `200` interval · `404` interval not found |
| `POST` | `/intervalli` | `data_inizio`, `data_fine`, `utent_id` (all required) | `201` created interval with its `id` · `400` missing data |
| `PATCH` | `/intervalli/:id` | `data_inizio`, `data_fine` (both required) | `200` updated · `400` missing dates or `data_fine` earlier than `data_inizio` · `404` interval not found |
| `DELETE` | `/intervalli/:id` | — | `200` deleted · `404` interval not found · `409` the interval has linked goals in `tabellaPonte` |
 
**Filters on `GET /intervalli`** (can be combined, joined with `AND`):
 
| Parameter | Meaning |
|---|---|
| `goal_id` | Only intervals linked to this goal |
| `data_inizio` | Only intervals whose `data_inizio` is **on or after** this date |
| `data_fine` | Only intervals whose `data_fine` is **on or before** this date |
 
Examples:
 
```
GET /intervalli?goal_id=1
GET /intervalli?data_inizio=2026-01-01&data_fine=2026-03-31
GET /intervalli?goal_id=2&data_inizio=2026-01-01
```
 
Each result contains `id`, `goal_id`, `data_inizio`, `data_fine`, `utent_id`. The query uses a `JOIN` with `tabellaPonte`, so **only intervals linked to at least one goal** are returned, and an interval linked to several goals appears once per goal.
 
#### 🔗 Junction table — `/tabellaPonte`
 
| Method | Endpoint | Body | Responses |
|---|---|---|---|
| `GET` | `/tabellaPonte` | — | `200` all links, with the goal `name`, `data_inizio`, `data_fine`, `intervallo_id`, `goal_id`, `status` (double `JOIN` with `intervalli` and `goals`) |
| `POST` | `/tabellaPonte` | `intervallo_id`, `goal_id` (both required) | `201` link created (initial status `active`) · `400` missing data |
| `PATCH` | `/tabellaPonte/:intervallo_id/:goal_id` | `status`: `active` · `finished` · `deleted` · `suspended` | `200` status updated · `400` invalid status · `404` link not found |
 
`PATCH` identifies the row using **both** parts of the composite primary key, passed in the URL.
 
### Example requests
 
```bash
# Create a user
curl -X POST http://localhost:3000/utents \
  -H "Content-Type: application/json" \
  -d '{"name": "Mario", "surname": "Rossi", "email": "mario.rossi@example.com"}'
 
# Create an interval for user 1
curl -X POST http://localhost:3000/intervalli \
  -H "Content-Type: application/json" \
  -d '{"data_inizio": "2026-01-01", "data_fine": "2026-01-31", "utent_id": 1}'
 
# Link interval 1 to goal 2
curl -X POST http://localhost:3000/tabellaPonte \
  -H "Content-Type: application/json" \
  -d '{"intervallo_id": 1, "goal_id": 2}'
 
# Pause that goal
curl -X PATCH http://localhost:3000/tabellaPonte/1/2 \
  -H "Content-Type: application/json" \
  -d '{"status": "suspended"}'
```
 
### Technical choices
 
- **Parameterized queries** (`?` placeholders + values array with `pool.execute`) for all user input, to protect against SQL injection.
- A `mysql2` **connection pool** instead of a single connection.
- **Credentials kept out of the code**, read from `.env` via `dotenv`.
- **Dynamic queries**: in the users `PATCH` and in the `GET /intervalli` filters, the query is built only from the fields/filters actually received.
- **Consistent HTTP status codes**: `201` for creation, `400` for invalid data, `404` when the resource does not exist (checking `rows.length` or `affectedRows`), `409` for foreign-key conflicts, `500` for server errors.
- **Soft delete** of user–goal links through the `status` column, instead of deleting rows.
### Current limitations
 
- No authentication: all endpoints are public.
- No automated tests (endpoints were tested manually with Postman).
- The server port (`3000`) is hard-coded in `index.js`.
- `POST /intervalli` does not check that `data_fine` is after `data_inizio` (the check exists only in `PATCH`).
### Author
 
**Gloria Maggioni** — [github.com/GloriaMaggioni](https://github.com/GloriaMaggioni)
 
### License
 
ISC (as declared in `package.json`).
