CREATE TABLE genre (
	genre_id SERIAL PRIMARY KEY,
	genre VARCHAR(255)
);

CREATE TABLE author (
	author_id SERIAL PRIMARY KEY,
	fname VARCHAR(255),
    lname VARCHAR(255),
	genre_id int,
	FOREIGN KEY (genre_id) REFERENCES genre(genre_id)
);

CREATE TABLE patron (
	patron_id SERIAL PRIMARY KEY,
	username VARCHAR(255),
	password VARCHAR(255)
);

CREATE TABLE books (
	book_id SERIAL PRIMARY KEY,
	title VARCHAR(255),
	author_id int NOT NULL,
    due_date DATE,
	year DATE,
	publisher VARCHAR(255),
	FOREIGN KEY (author_id) REFERENCES author(author_id)
);

CREATE TABLE patron_book ( 
    patron_id int
    , book_id int
);