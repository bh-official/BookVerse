CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    description TEXT,
    quote VARCHAR(255),
    released DATE,
    img_url TEXT
);

CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255)
);

CREATE TABLE book_genres (
    id SERIAL PRIMARY KEY,
    book_id INT,
    genre_id INT,
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (genre_id) REFERENCES genres(id)
);

CREATE TABLE user_account (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    bio TEXT,
    clerk_id TEXT
);

CREATE TABLE review (
    id SERIAL PRIMARY KEY,
    user_id INT,
    book_id INT,
    content TEXT,
    FOREIGN KEY (user_id) REFERENCES user_account(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);