CREATE DATABASE IF NOT EXISTS epytodo;

USE epytodo;

SET foreign_key_checks = 0;

DROP TABLE IF EXISTS user;

SET foreign_key_checks = 1;

CREATE TABLE user (
  id int unsigned NOT NULL AUTO_INCREMENT,
  email varchar(100) UNIQUE NOT NULL,
  password varchar(100) NOT NULL,
  name varchar(100) NOT NULL,
  firstname varchar(100) NOT NULL,
  created_at datetime DEFAULT current_timestamp(),
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS todo;

CREATE TABLE todo (
  id int unsigned NOT NULL AUTO_INCREMENT,
  title varchar(100) NOT NULL,
  description text NOT NULL,
  created_at datetime DEFAULT current_timestamp(),
  due_time datetime NOT NULL,
  status enum('not started','todo','in progress','done') NOT NULL DEFAULT 'not started',
  user_id int unsigned NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT usridfk FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);
