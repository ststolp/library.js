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
	username VARCHAR(255) UNIQUE,
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
------------------------------------------------------------------
INSERT INTO genre ( genre)
VALUES ('Action');

INSERT INTO author (fname, lname, genre_id)
VALUES ('Suzanne', 'Collins', (SELECT genre_id FROM genre WHERE genre = 'Action') );
-----------------------------------------------------------------------------------------
INSERT INTO books (title, author_id, due_date, year, publisher)
VALUES ('The Hunger Games', (SELECT author_id FROM author WHERE lname = 'Collins')
, LOCALTIMESTAMP(2) + interval '30' day, '2008-10-10 10:10:10', 'Scholastic');

INSERT INTO books ( title, author_id, due_date, year, publisher)
VALUES ( 'Catching Fire', (SELECT author_id FROM author WHERE lname = 'Collins')
, LOCALTIMESTAMP(2) + interval '30' day, '2009-10-10 10:10:10', 'Scholastic');

INSERT INTO books (title, author_id, due_date, year, publisher)
VALUES ('Mockingjay', (SELECT author_id FROM author WHERE lname = 'Collins')
, LOCALTIMESTAMP(2) + interval '30' day, '2010-10-10 10:10:10', 'Scholastic');
