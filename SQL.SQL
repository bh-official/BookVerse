-- ============================================
-- DATABASE SCHEMA
-- ============================================

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    user_id INT,
    title VARCHAR(255),
    author VARCHAR(255),
    description TEXT,
    quote VARCHAR(255),
    released DATE,
    img_url TEXT,
    FOREIGN KEY (user_id) REFERENCES user_account(id)
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

CREATE TABLE postss (
    id SERIAL PRIMARY KEY,
    user_id INT,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_account(id)
);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert 5 user profiles
INSERT INTO user_account (username, bio, clerk_id) VALUES 
('BookwormAlice', 'Avid reader and fantasy enthusiast', 'user_alice_123'),
('MysteryMike', 'Thriller and mystery lover', 'user_mike_456'),
('SciFiSarah', 'Science fiction addict', 'user_sarah_789'),
('RomanceRachel', 'Love stories and happy endings', 'user_rachel_101'),
('ClassicCarl', 'Literature purist', 'user_carl_202');

-- Insert 5 genres
INSERT INTO genres (name, description) VALUES 
('Fantasy', 'Magical worlds and mythical creatures'),
('Mystery', 'Whodunits and detective stories'),
('Science Fiction', 'Future tech and space adventures'),
('Romance', 'Love and relationships'),
('Classic', 'Timeless literary works');

-- Insert 12 books
INSERT INTO books (title, author, description, quote, released, img_url) VALUES 
('The Hobbit', 'J.R.R. Tolkien', 'A hobbits unexpected journey', 'In a hole in the ground there lived a hobbit.', '1937-09-21', 'https://covers.openlibrary.org/b/id/6979861-L.jpg'),
('1984', 'George Orwell', 'Dystopian social science fiction', 'Big Brother is watching you.', '1949-06-08', 'https://covers.openlibrary.org/b/id/7222246-L.jpg'),
('Pride and Prejudice', 'Jane Austen', 'Romantic novel of manners', 'It is a truth universally acknowledged...', '1813-01-28', 'https://covers.openlibrary.org/b/id/8231856-L.jpg'),
('The Great Gatsby', 'F. Scott Fitzgerald', 'Jazz Age tragedy', 'So we beat on, boats against the current.', '1925-04-10', 'https://covers.openlibrary.org/b/id/7222246-L.jpg'),
('Dune', 'Frank Herbert', 'Epic science fiction', 'I must not fear. Fear is the mind-killer.', '1965-08-01', 'https://covers.openlibrary.org/b/id/8091016-L.jpg'),
('The Catcher in the Rye', 'J.D. Salinger', 'Coming-of-age novel', 'If you want to know the truth, I dont know what to think.', '1951-07-16', 'https://covers.openlibrary.org/b/id/8231637-L.jpg'),
('Murder on the Orient Express', 'Agatha Christie', 'Classic detective mystery', 'The impossible could not have happened, therefore the impossible must be possible.', '1934-01-01', 'https://covers.openlibrary.org/b/id/8289551-L.jpg'),
('Foundation', 'Isaac Asimov', 'Space opera', 'Violence is the last refuge of the incompetent.', '1951-05-01', 'https://covers.openlibrary.org/b/id/6305602-L.jpg'),
('The Fellowship of the Ring', 'J.R.R. Tolkien', 'Epic fantasy adventure', 'One Ring to rule them all, One Ring to find them.', '1954-07-29', 'https://covers.openlibrary.org/b/id/8406786-L.jpg'),
('To Kill a Mockingbird', 'Harper Lee', 'Southern Gothic novel', 'You never really understand a person...', '1960-07-11', 'https://covers.openlibrary.org/b/id/8228691-L.jpg'),
('Brave New World', 'Aldous Huxley', 'Dystopian novel', 'Community, Identity, Stability.', '1932-01-01', 'https://covers.openlibrary.org/b/id/5112153-L.jpg'),
('The Lord of the Rings', 'J.R.R. Tolkien', 'Epic fantasy trilogy', 'Not all those who wander are lost.', '1954-07-29', 'https://covers.openlibrary.org/b/id/8406786-L.jpg');

-- Insert 20 posts
INSERT INTO posts (user_id, content) VALUES 
(1, 'Just finished The Hobbit and loved it! Bilbos journey was incredible.'),
(1, 'Anyone else think fantasy is the best genre? The world-building is unmatched!'),
(2, 'Working through the classics. Currently reading Sherlock Holmes.'),
(2, 'Mystery novels keep me up at night - in a good way!'),
(3, 'Dune is everything! The world building is absolutely mind-blowing.'),
(3, 'Foundation by Asimov changed how I think about prediction and history.'),
(4, 'Pride and Prejudice is my comfort read. Mr. Darcy is goals!'),
(4, 'Looking for new romance recommendations. Any suggestions?'),
(5, '1984 is terrifyingly relevant today. Everyone should read it.'),
(5, 'The Great Gatsby is pure literary perfection. Fitzgerald was a genius.'),
(1, 'Starting The Lord of the Rings trilogy today! So excited!'),
(2, 'Agatha Christie is the queen of mystery. Murder on the Orient Express was brilliant!'),
(3, 'Brave New World made me question society. What a book!'),
(4, 'To Kill a Mockingbird - a must read for everyone.'),
(5, 'The Catcher in the Rye is so relatable. Teenage angst at its finest.'),
(1, 'Fantasy books are the best escape from reality.'),
(2, 'Nothing beats a good mystery with an unexpected twist!'),
(3, 'Science fiction expands your imagination like nothing else.'),
(4, 'Romance novels have the best character development - love the emotional journeys.'),
(5, 'Classic literature never goes out of style. Timeless stories.');

-- Insert 30 reviews
INSERT INTO review (user_id, book_id, content) VALUES 
(1, 1, 'A magical adventure that captures the essence of heroism. Tolkien is a master!'),
(1, 9, 'The Fellowship was incredible. Cant wait to read the rest!'),
(1, 11, 'Thought-provoking and disturbing in the best way possible.'),
(2, 7, 'Classic Christie - kept me guessing until the end!'),
(2, 2, 'A chilling portrayal of totalitarianism. Very relevant today.'),
(2, 6, 'Holdens voice is so authentic. A timeless coming-of-age story.'),
(3, 5, 'Dune is a masterpiece of world-building. The politics are fascinating!'),
(3, 8, 'Asimovs Foundation series is groundbreaking sci-fi. Essential reading!'),
(3, 11, 'Huxley predicted so much. Scary how accurate it is.'),
(3, 2, 'Big Brother is watching - and were still talking about it!'),
(4, 3, 'Elizabeth Bennet is the best protagonist ever written. Love this book!'),
(4, 4, 'The Gatsby lifestyle is so captivating. A tragic hero for the ages.'),
(4, 10, 'Atticus Finch is the moral compass we need. Heartbreaking and beautiful.'),
(4, 3, 'Austens wit is unmatched. Re-read this every year!'),
(5, 4, 'The Great American Novel. Fitzgeralds prose is poetry.'),
(5, 10, 'A powerful exploration of racism and justice in the American South.'),
(5, 2, 'Orwell was a prophet. Read this and be terrified.'),
(5, 6, 'Salingers writing captures teenage alienation perfectly.'),
(1, 12, 'The Lord of the Rings is the gold standard for fantasy. Epic!'),
(2, 9, 'One Ring to rule them all - what an adventure!'),
(3, 1, 'The Hobbit is the perfect introduction to Middle-earth.'),
(4, 1, 'Bilbo is the most adorable protagonist. Pure joy!'),
(5, 7, 'The detective work in this book is brilliant.'),
(1, 5, 'Paul Atreides is one of sci-fis greatest characters.'),
(2, 8, 'Psychohistory is such an interesting concept.'),
(3, 4, 'The green light symbolizes so much. Gatsby is genius.'),
(4, 11, 'A disturbing but necessary read about societys future.'),
(5, 9, 'The world-building in Tolkiens work is unparalleled.'),
(1, 10, 'Harper Lees masterpiece about courage and justice.'),
(2, 5, 'Frank Herbert created an entire universe. Impressive!');

-- Insert book_genres associations
INSERT INTO book_genres (book_id, genre_id) VALUES 
(1, 1), (2, 3), (3, 4), (4, 4), (5, 3), (6, 5), (7, 2), (8, 3), (9, 1), (10, 5), (11, 3), (12, 1);
