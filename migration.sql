-- created il DB --
CREATE DATABASE meditActiveDB;

-- selcted the db we need to use --
USE meditActiveDB


-- ccreate utents's table where we save the utents's datas --
CREATE TABLE utents(
  PRIMARY KEY (id),
  id INT AUTO_INCREMENT,    
  name VARCHAR(50),    -- max 50 caracters --
  surname VARCHAR(50), -- max 50 caracters --
  email VARCHAR(100)  -- max 100 caracters --
);

-- created goal's (obiettivi) table where we save the goal's datas -- 
CREATE TABLE goals (
id INT AUTO_INCREMENT,
name VARCHAR(100),
PRIMARY KEY (id)
)



-- create the intervalli's table where we save the datas aboout the intervals of every goals --
CREATE TABLE intervalli (
 id INT AUTO_INCREMENT,
 data_inizio DATE,
 data_fine DATE,
 utent_id INT,
 FOREIGN KEY (utent_id) REFERENCES utents(id),      -- reference of  id's utents table --
 PRIMARY KEY (id)
) ;


-- table that connect data's of intervalli and datas of utents together --
CREATE TABLE tabellaPonte (
intervallo_id INT,
goal_id INT,
PRIMARY KEY (intervallo_id, goal_id),
FOREIGN KEY (intervallo_id) REFERENCES intervalli(id),
FOREIGN KEY (goal_id) REFERENCES goals(id)
)
