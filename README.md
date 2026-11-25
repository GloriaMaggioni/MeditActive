# MeditActive 

**MeditActive** is the backend of a wellness app that offers users a catalog of **predefined goals** to improve their lifestyle.
 
This repository contains a **REST API** built with **Node.js + Express** and a **MySQL** database. It lets you:
 
- manage **users** (full CRUD);
- read the **goals catalog** (`goals`);
- manage each user's **time intervals** (start date and end date), with **filters** by goal and by date;
- link an interval to one or more goals through the nested resource **`/intervals/:id/goals`** (stored in the junction table `tabellaPonte`) and update the link's **status** (`active`, `finished`, `deleted`, `suspended`).
A goal in the catalog is never deleted: when a user stops following it, the status of the link in the junction table is updated instead (*soft delete*).
 
> Note: the API (URLs, routers, files, messages) is in English. Two database tables and some fields keep their original Italian names (e.g. `intervalli` = intervals, `data_inizio` = start date, `data_fine` = end date, `tabellaPonte` = junction table).
 
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
│   ├── usersControllers.js
│   ├── goalsControllers.js
│   ├── intervalsControllers.js       # includes checkDate(), the date validation
│   └── intervalGoalsControllers.js
├── routes/                           # Routes only, wired to the controllers
│   ├── users.js
│   ├── goals.js
│   ├── intervals.js
│   └── intervalGoals.js              # nested resource /intervals/:id/goals
├── middleware/
│   └── errorHandler.js               # Centralized error handling
├── utils/
│   └── checkId.js                    # Validates the ids received in the URL
├── index.js                          # Entry point: express.json(), routes, 404 middleware, error handler
├── migration.sql                     # Script that creates the database and tables
├── database-schema-en.png            # Database schema image
├── .env.example                      # Template for the .env file
├── package.json
└── .gitignore
```
 
The project separates **routes** (which URL and which HTTP method) from **controllers** (what happens when that route is called).
 
### Database
 
Database: `meditActiveDB` — 4 tables.
 
| Table | Content |
|---|---|
| `users` | Users: `id`, `name`, `surname`, `email` (all `NOT NULL`, `email` is `UNIQUE`) |
| `goals` | Catalog of predefined goals: `id`, `name` |
| `intervalli` | Time intervals: `id`, `data_inizio`, `data_fine`, `user_id` (FK → `users.id`), all `NOT NULL` |
| `tabellaPonte` | Junction table (many-to-many relationship between intervals and goals): `intervallo_id` (FK → `intervalli.id`), `goal_id` (FK → `goals.id`), `status`. **Composite primary key** (`intervallo_id`, `goal_id`) |
 
The `status` column of `tabellaPonte` is defined as:
 
```sql
status ENUM('active','finished','deleted','suspended') NOT NULL DEFAULT 'active'
```
 
Database schema:

<img width="1200" height="2200" alt="database-schema-en" src="https://github.com/user-attachments/assets/2dc98c54-592f-40b8-8ca1-45e598333f0a" />

 
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
4. **Insert the catalog goals.** After the migration the `goals` table is empty and the API has no endpoint to create goals (the catalog is predefined), so they must be inserted directly into the database. This step is required: without goals, `GET /goals` returns an empty list and `POST /intervals/:id/goals` fails, because `goal_id` must reference an existing goal (foreign key).
```sql
   INSERT INTO goals (name) VALUES ('Goal name 1'), ('Goal name 2');
```
 
5. **Create a `.env` file** in the project root (you can copy `.env.example`) with your settings:
```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=meditActiveDB
   PORT=3000
```
 
   `DB_PORT` is the MySQL port, `PORT` is the Express server port (optional, default `3000`). The `.env` file is excluded from Git via `.gitignore`.
 
6. **Start the server**
```bash
   npm run dev    # development (nodemon)
   npm start      # production (node)
```
 
   The server listens on **http://localhost:3000** (or on the port set in `PORT`).
 
### API endpoints
 
All requests with a body use **JSON** (`Content-Type: application/json`). Dates use the MySQL `DATE` format: `YYYY-MM-DD`.
Errors thrown by the database go to a centralized error handler (see [Error handling](#error-handling)); an unexpected server or database error responds with **500**.

Ids in the URL are checked with `checkId()` before the query (routes marked `400 invalid id`): an id that is not a positive integer (`abc`, `0`, `-3`) gets **400**, a valid id that does not exist gets **404**.
 
#### 👤 Users — `/users`
 
| Method | Endpoint | Body | Responses |
|---|---|---|---|
| `GET` | `/users` | — | `200` list of all users |
| `GET` | `/users/:id` | — | `200` user · `400` invalid id · `404` user not found |
| `POST` | `/users` | `name`, `surname`, `email` (all required) | `201` created user with its `id` · `400` missing data · `409` email already in use |
| `PUT` | `/users/:id` | `name`, `surname`, `email` (all required) | `200` user updated · `400` incomplete data · `404` user not found |
| `PATCH` | `/users/:id` | at least one of `name`, `surname`, `email` | `200` partial update · `400` no valid field · `404` user not found |
| `DELETE` | `/users/:id` | — | `200` user deleted · `404` user not found |
 
`PATCH` builds the query **dynamically**: it only updates the fields present in the body.
 
#### 🎯 Goals — `/goals`
 
| Method | Endpoint | Responses |
|---|---|---|
| `GET` | `/goals` | `200` full goals catalog |
| `GET` | `/goals/:id` | `200` goal · `400` invalid id · `404` goal not found |
 
#### 📅 Intervals — `/intervals`
 
| Method | Endpoint | Body | Responses |
|---|---|---|---|
| `GET` | `/intervals` | — (optional query-string filters, see below) | `200` list of intervals |
| `GET` | `/intervals/:id` | — | `200` interval · `400` invalid id · `404` interval not found |
| `POST` | `/intervals` | `data_inizio`, `data_fine`, `user_id` (all required) | `201` created interval with its `id` · `400` missing data, invalid dates, `data_fine` earlier than `data_inizio`, or `user_id` that does not exist |
| `PATCH` | `/intervals/:id` | `data_inizio`, `data_fine` (both required) | `200` updated · `400` missing or invalid dates, or `data_fine` earlier than `data_inizio` · `404` interval not found |
| `DELETE` | `/intervals/:id` | — | `200` deleted · `404` interval not found · `409` the interval has linked goals in `tabellaPonte` |

`POST` and `PATCH` use the same function, `checkDate()`, to validate the dates.
 
**Filters on `GET /intervals`** (can be combined, joined with `AND`):
 
| Parameter | Meaning |
|---|---|
| `goal_id` | Only intervals linked to this goal |
| `data_inizio` | Only intervals whose `data_inizio` is **on or after** this date |
| `data_fine` | Only intervals whose `data_fine` is **on or before** this date |
 
Examples:
 
```
GET /intervals?goal_id=1
GET /intervals?data_inizio=2026-01-01&data_fine=2026-03-31
GET /intervals?goal_id=2&data_inizio=2026-01-01
```
 
Each result contains `id`, `dataInizio`, `dataFine`, `userId` and `goals` (array of goal ids). The query starts `FROM intervalli` with a `LEFT JOIN` on `tabellaPonte`, so **intervals without goals are included too** (with `goals: []`). The rows are then grouped in JavaScript, so **every interval appears only once**, with all its goals. With the `goal_id` filter, `goals` contains only the filtered goal.
 
#### 🔗 Goals of an interval — `/intervals/:id/goals`

The links between intervals and goals (rows of `tabellaPonte`) are a **nested resource** of the interval: `/intervals/9/goals` = the goals of interval 9.
 
| Method | Endpoint | Body | Responses |
|---|---|---|---|
| `GET` | `/intervals/:id/goals` | — | `200` the goals of the interval, with the goal `name`, `data_inizio`, `data_fine`, `intervallo_id`, `goal_id`, `status` (double `JOIN` with `intervalli` and `goals`); empty list if there are none · `400` invalid id |
| `POST` | `/intervals/:id/goals` | `goal_id` (required) | `201` link created (initial status `active`) · `400` missing data, invalid id, or goal/interval that does not exist · `409` goal already linked to this interval |
| `PATCH` | `/intervals/:intervallo_id/goals/:goal_id` | `status`: `active` · `finished` · `deleted` · `suspended` | `200` status updated · `400` invalid id or invalid status · `404` link not found |
 
`PATCH` identifies the row using **both** parts of the composite primary key, passed in the URL. The router is created with `express.Router({ mergeParams: true })`, so it can read the `:id` of the mount path.

### Error handling

- Every controller passes database errors to Express with `next(err)` in its `catch` block.
- `middleware/errorHandler.js` (`(err, req, res, next)`, registered at the end of `index.js`) reads `err.code` in a `switch` and chooses status and message:

| `err.code` | Status |
|---|---|
| `ER_DUP_ENTRY` | `409` duplicate value (same email, same link twice) |
| `ER_NO_REFERENCED_ROW_2` · `ER_BAD_NULL_ERROR` · `ER_DATA_TOO_LONG` | `400` invalid data |
| `INVALID_ID` (custom error created by `checkId()`) | `400` invalid id |
| anything else | `500` |

- A **404 middleware** answers routes that do not exist with JSON instead of the default Express HTML page.
- Order in `index.js`: `express.json()` → routes → 404 middleware → `errorHandler` → `listen`.
 
### Example requests
 
```bash
# Create a user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Mario", "surname": "Rossi", "email": "mario.rossi@example.com"}'
 
# Create an interval for user 1
curl -X POST http://localhost:3000/intervals \
  -H "Content-Type: application/json" \
  -d '{"data_inizio": "2026-01-01", "data_fine": "2026-01-31", "user_id": 1}'
 
# Link interval 1 to goal 2
curl -X POST http://localhost:3000/intervals/1/goals \
  -H "Content-Type: application/json" \
  -d '{"goal_id": 2}'
 
# Pause that goal
curl -X PATCH http://localhost:3000/intervals/1/goals/2 \
  -H "Content-Type: application/json" \
  -d '{"status": "suspended"}'
```
 
### Technical choices
 
- **Parameterized queries** (`?` placeholders + values array with `pool.execute`) for all user input, to protect against SQL injection.
- A `mysql2` **connection pool** instead of a single connection.
- **Configuration kept out of the code** (credentials and server port), read from `.env` via `dotenv`.
- **Centralized error handling** in one middleware, plus a 404 middleware for unknown routes.
- **Validation before the query:** `checkId()` for the ids in the URL, `checkDate()` for the dates.
- **Constraints in the schema** (`NOT NULL`, `UNIQUE`, foreign keys) as the last line of defense.
- **`LEFT JOIN` + grouping in JavaScript** in `GET /intervals`, so every interval appears once with its goals.
- **Nested resource** `/intervals/:id/goals` for the interval–goal links.
- **Dynamic queries**: in the users `PATCH` and in the `GET /intervals` filters, the query is built only from the fields/filters actually received.
- **Consistent HTTP status codes**: `201` for creation, `400` for invalid data, `404` when the resource does not exist (checking `rows.length` or `affectedRows`), `409` for conflicts, `500` for server errors.
- **Soft delete** of user–goal links through the `status` column, instead of deleting rows.
### Current limitations
 
- No authentication: all endpoints are public.
- No automated tests (endpoints were tested manually with Postman).
- `PUT`, `PATCH`, `DELETE /users/:id` and `PATCH`, `DELETE /intervals/:id` do not validate the id yet (an id like `abc` gets `404` instead of `400`).
- Deleting a user who still has intervals returns `500` (the foreign-key conflict is handled as `409` only in `DELETE /intervals/:id`).
- `mysql2` returns `DATE` columns as full timestamps (e.g. `2026-01-01T05:00:00.000Z`).
### Author
 
**Gloria Maggioni** — [github.com/GloriaMaggioni](https://github.com/GloriaMaggioni)
 
### License
 
ISC (as declared in `package.json`).
**Gloria Maggioni** — [github.com/GloriaMaggioni](https://github.com/GloriaMaggioni)
 
### License
 
ISC (as declared in `package.json`).
