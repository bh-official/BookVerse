// Seed script to populate the database with sample data
// Run with: node src/utils/seed.js

const { db } = require("./db");

async function seed() {
  console.log("Starting database seed...");

  // 1. Seed user_account table (5 users)
  const users = [
    {
      username: "BookwormAlice",
      bio: "Avid reader and fantasy enthusiast",
      clerk_id: "user_alice_123",
    },
    {
      username: "MysteryMike",
      bio: "Thriller and mystery lover",
      clerk_id: "user_mike_456",
    },
    {
      username: "SciFiSarah",
      bio: "Science fiction addict",
      clerk_id: "user_sarah_789",
    },
    {
      username: "RomanceRachel",
      bio: "Love stories and happy endings",
      clerk_id: "user_rachel_101",
    },
    {
      username: "ClassicCarl",
      bio: "Literature purist",
      clerk_id: "user_carl_202",
    },
  ];

  console.log("Seeding users...");
  for (const user of users) {
    await db.query(
      `INSERT INTO user_account (username, bio, clerk_id) VALUES ($1, $2, $3)`,
      [user.username, user.bio, user.clerk_id],
    );
  }

  // 2. Seed genres table (5 genres)
  const genres = [
    { name: "Fantasy", description: "Magical worlds and mythical creatures" },
    { name: "Mystery", description: "Whodunits and detective stories" },
    {
      name: "Science Fiction",
      description: "Future tech and space adventures",
    },
    { name: "Romance", description: "Love and relationships" },
    { name: "Classic", description: "Timeless literary works" },
  ];

  console.log("Seeding genres...");
  for (const genre of genres) {
    await db.query(`INSERT INTO genres (name, description) VALUES ($1, $2)`, [
      genre.name,
      genre.description,
    ]);
  }

  // 3. Seed books table (need at least 10 books for reviews)
  const books = [
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      description: "A hobbit's unexpected journey",
      quote: "In a hole in the ground there lived a hobbit.",
      released: "1937-09-21",
      img_url: "https://covers.openlibrary.org/b/id/6979861-L.jpg",
    },
    {
      title: "1984",
      author: "George Orwell",
      description: "Dystopian social science fiction",
      quote: "Big Brother is watching you.",
      released: "1949-06-08",
      img_url: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      description: "Romantic novel of manners",
      quote: "It is a truth universally acknowledged...",
      released: "1813-01-28",
      img_url: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
    },
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      description: "Jazz Age tragedy",
      quote: "So we beat on, boats against the current.",
      released: "1925-04-10",
      img_url: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    },
    {
      title: "Dune",
      author: "Frank Herbert",
      description: "Epic science fiction",
      quote: "I must not fear. Fear is the mind-killer.",
      released: "1965-08-01",
      img_url: "https://covers.openlibrary.org/b/id/8091016-L.jpg",
    },
    {
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      description: "Coming-of-age novel",
      quote: "If you want to know the truth, I don't know what to think.",
      released: "1951-07-16",
      img_url: "https://covers.openlibrary.org/b/id/8231637-L.jpg",
    },
    {
      title: "Murder on the Orient Express",
      author: "Agatha Christie",
      description: "Classic detective mystery",
      quote:
        "The impossible could not have happened, therefore the impossible must be possible.",
      released: "1934-01-01",
      img_url: "https://covers.openlibrary.org/b/id/8289551-L.jpg",
    },
    {
      title: "Foundation",
      author: "Isaac Asimov",
      description: "Space opera",
      quote: "Violence is the last refuge of the incompetent.",
      released: "1951-05-01",
      img_url: "https://covers.openlibrary.org/b/id/6305602-L.jpg",
    },
    {
      title: "The Fellowship of the Ring",
      author: "J.R.R. Tolkien",
      description: "Epic fantasy adventure",
      quote: "One Ring to rule them all, One Ring to find them.",
      released: "1954-07-29",
      img_url: "https://covers.openlibrary.org/b/id/8406786-L.jpg",
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      description: "Southern Gothic novel",
      quote: "You never really understand a person...",
      released: "1960-07-11",
      img_url: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
    },
    {
      title: "Brave New World",
      author: "Aldous Huxley",
      description: "Dystopian novel",
      quote: "Community, Identity, Stability.",
      released: "1932-01-01",
      img_url: "https://covers.openlibrary.org/b/id/5112153-L.jpg",
    },
    {
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      description: "Epic fantasy trilogy",
      quote: "Not all those who wander are lost.",
      released: "1954-07-29",
      img_url: "https://covers.openlibrary.org/b/id/8406786-L.jpg",
    },
  ];

  console.log("Seeding books...");
  for (const book of books) {
    await db.query(
      `INSERT INTO books (title, author, description, quote, released, img_url) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        book.title,
        book.author,
        book.description,
        book.quote,
        book.released,
        book.img_url,
      ],
    );
  }

  // 4. Seed posts table (20 posts)
  const posts = [
    {
      user_id: 1,
      content:
        "Just finished The Hobbit and loved it! Bilbos journey was incredible.",
    },
    {
      user_id: 1,
      content:
        "Anyone else think fantasy is the best genre? The world-building is unmatched!",
    },
    {
      user_id: 2,
      content:
        "Working through the classics. Currently reading Sherlock Holmes.",
    },
    {
      user_id: 2,
      content: "Mystery novels keep me up at night - in a good way!",
    },
    {
      user_id: 3,
      content:
        "Dune is everything! The world building is absolutely mind-blowing.",
    },
    {
      user_id: 3,
      content:
        "Foundation by Asimov changed how I think about prediction and history.",
    },
    {
      user_id: 4,
      content: "Pride and Prejudice is my comfort read. Mr. Darcy is goals! 💕",
    },
    {
      user_id: 4,
      content: "Looking for new romance recommendations. Any suggestions?",
    },
    {
      user_id: 5,
      content: "1984 is terrifyingly relevant today. Everyone should read it.",
    },
    {
      user_id: 5,
      content:
        "The Great Gatsby is pure literary perfection. Fitzgerald was a genius.",
    },
    {
      user_id: 1,
      content: "Starting The Lord of the Rings trilogy today! So excited!",
    },
    {
      user_id: 2,
      content:
        "Agatha Christie is the queen of mystery. Murder on the Orient Express was brilliant!",
    },
    {
      user_id: 3,
      content: "Brave New World made me question society. What a book!",
    },
    {
      user_id: 4,
      content: "To Kill a Mockingbird - a must read for everyone.",
    },
    {
      user_id: 5,
      content:
        "The Catcher in the Rye is so relatable. Teenage angst at its finest.",
    },
    { user_id: 1, content: "Fantasy books are the best escape from reality." },
    {
      user_id: 2,
      content: "Nothing beats a good mystery with an unexpected twist!",
    },
    {
      user_id: 3,
      content: "Science fiction expands your imagination like nothing else.",
    },
    {
      user_id: 4,
      content:
        "Romance novels have the best character development - love the emotional journeys.",
    },
    {
      user_id: 5,
      content: "Classic literature never goes out of style. Timeless stories.",
    },
  ];

  console.log("Seeding posts...");
  for (const post of posts) {
    await db.query(`INSERT INTO posts (user_id, content) VALUES ($1, $2)`, [
      post.user_id,
      post.content,
    ]);
  }

  // 5. Seed review table (30 reviews)
  const reviews = [
    {
      user_id: 1,
      book_id: 1,
      content:
        "A magical adventure that captures the essence of heroism. Tolkien is a master!",
    },
    {
      user_id: 1,
      book_id: 9,
      content: "The Fellowship was incredible. Can't wait to read the rest!",
    },
    {
      user_id: 1,
      book_id: 11,
      content: "Thought-provoking and disturbing in the best way possible.",
    },
    {
      user_id: 2,
      book_id: 7,
      content: "Classic Christie - kept me guessing until the end!",
    },
    {
      user_id: 2,
      book_id: 2,
      content: "A chilling portrayal of totalitarianism. Very relevant today.",
    },
    {
      user_id: 2,
      book_id: 6,
      content:
        "Holden's voice is so authentic. A timeless coming-of-age story.",
    },
    {
      user_id: 3,
      book_id: 5,
      content:
        "Dune is a masterpiece of world-building. The politics are fascinating!",
    },
    {
      user_id: 3,
      book_id: 8,
      content:
        "Asimov's Foundation series is groundbreaking sci-fi. Essential reading!",
    },
    {
      user_id: 3,
      book_id: 11,
      content: "Huxley predicted so much. Scary how accurate it is.",
    },
    {
      user_id: 3,
      book_id: 2,
      content: "Big Brother is watching - and we're still talking about it!",
    },
    {
      user_id: 4,
      book_id: 3,
      content:
        "Elizabeth Bennet is the best protagonist ever written. Love this book!",
    },
    {
      user_id: 4,
      book_id: 4,
      content:
        "The Gatsby lifestyle is so captivating. A tragic hero for the ages.",
    },
    {
      user_id: 4,
      book_id: 10,
      content:
        "Atticus Finch is the moral compass we need. Heartbreaking and beautiful.",
    },
    {
      user_id: 4,
      book_id: 3,
      content: "Austen's wit is unmatched. Re-read this every year!",
    },
    {
      user_id: 5,
      book_id: 4,
      content: "The Great American Novel. Fitzgerald's prose is poetry.",
    },
    {
      user_id: 5,
      book_id: 10,
      content:
        "A powerful exploration of racism and justice in the American South.",
    },
    {
      user_id: 5,
      book_id: 2,
      content: "Orwell was a prophet. Read this and be terrified.",
    },
    {
      user_id: 5,
      book_id: 6,
      content: "Salinger's writing captures teenage alienation perfectly.",
    },
    {
      user_id: 1,
      book_id: 12,
      content: "The Lord of the Rings is the gold standard for fantasy. Epic!",
    },
    {
      user_id: 2,
      book_id: 9,
      content: "One Ring to rule them all - what an adventure!",
    },
    {
      user_id: 3,
      book_id: 1,
      content: "The Hobbit is the perfect introduction to Middle-earth.",
    },
    {
      user_id: 4,
      book_id: 1,
      content: "Bilbo is the most adorable protagonist. Pure joy!",
    },
    {
      user_id: 5,
      book_id: 7,
      content: "The detective work in this book is brilliant.",
    },
    {
      user_id: 1,
      book_id: 5,
      content: "Paul Atreides is one of sci-fi's greatest characters.",
    },
    {
      user_id: 2,
      book_id: 8,
      content: "Psychohistory is such an interesting concept.",
    },
    {
      user_id: 3,
      book_id: 4,
      content: "The green light symbolizes so much. Gatsby is genius.",
    },
    {
      user_id: 4,
      book_id: 11,
      content: "A disturbing but necessary read about society's future.",
    },
    {
      user_id: 5,
      book_id: 9,
      content: "The world-building in Tolkien's work is unparalleled.",
    },
    {
      user_id: 1,
      book_id: 10,
      content: "Harper Lee's masterpiece about courage and justice.",
    },
    {
      user_id: 2,
      book_id: 5,
      content: "Frank Herbert created an entire universe. Impressive!",
    },
  ];

  console.log("Seeding reviews...");
  for (const review of reviews) {
    await db.query(
      `INSERT INTO review (user_id, book_id, content) VALUES ($1, $2, $3)`,
      [review.user_id, review.book_id, review.content],
    );
  }

  // 6. Seed book_genres table
  const bookGenres = [
    { book_id: 1, genre_id: 1 },
    { book_id: 2, genre_id: 3 },
    { book_id: 3, genre_id: 4 },
    { book_id: 4, genre_id: 4 },
    { book_id: 5, genre_id: 3 },
    { book_id: 6, genre_id: 5 },
    { book_id: 7, genre_id: 2 },
    { book_id: 8, genre_id: 3 },
    { book_id: 9, genre_id: 1 },
    { book_id: 10, genre_id: 5 },
    { book_id: 11, genre_id: 3 },
    { book_id: 12, genre_id: 1 },
  ];

  console.log("Seeding book genres...");
  for (const bg of bookGenres) {
    await db.query(
      `INSERT INTO book_genres (book_id, genre_id) VALUES ($1, $2)`,
      [bg.book_id, bg.genre_id],
    );
  }

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
