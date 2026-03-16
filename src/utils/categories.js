import { db } from "./db";

// Default fallback categories (only used if database is empty)
export const BOOK_CATEGORIES = [
  "Fiction",
  "Non-Fiction",
  "Horror",
  "Fantasy",
  "Comedy",
  "Jokes",
  "Funny",
  "Children",
  "Romance",
  "Mystery",
  "Thriller",
  "Science Fiction",
  "Biography",
  "History",
  "Self-Help",
  "Poetry",
  "Drama",
  "Adventure",
  "Crime",
  "Dystopian",
  "Coding",
];

// Predefined emoji map for known categories
const emojiMap = {
  Fiction: "📖",
  "Non-Fiction": "📚",
  Horror: "👻",
  Fantasy: "🧙",
  Comedy: "😂",
  Jokes: "🤣",
  Funny: "😄",
  Children: "👶",
  Romance: "💕",
  Mystery: "🔍",
  Thriller: "😱",
  "Science Fiction": "🚀",
  Biography: "👤",
  History: "🏛️",
  "Self-Help": "💡",
  Poetry: "📝",
  Drama: "🎭",
  Adventure: "⚔️",
  Crime: "🔪",
  Dystopian: "🌆",
  Coding: "💻",
};

// Auto-generated emoji based on category name (for unknown categories)
function generateEmoji(category) {
  const emojis = [
    "📕",
    "📗",
    "📘",
    "📙",
    "📓",
    "📔",
    "📒",
    "📑",
    "📈",
    "📉",
    "📊",
    "📋",
    "🔖",
    "📌",
    "📍",
    "🏷️",
    "📎",
    "🖇️",
    "📐",
    "📏",
  ];
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return emojis[Math.abs(hash) % emojis.length];
}

export function getCategoryEmoji(category) {
  // First check predefined map
  if (emojiMap[category]) {
    return emojiMap[category];
  }
  // Auto-generate emoji for unknown categories
  return generateEmoji(category);
}

// Dynamically fetch ALL unique categories from the database
export async function getCategories() {
  try {
    // Fetch all unique non-empty categories from books table
    const result = await db.query(
      `SELECT DISTINCT category FROM books WHERE category IS NOT NULL AND category != '' ORDER BY category`,
    );

    // Extract categories from result
    const dbCategories = result.rows.map((row) => row.category);

    // If database has categories, return them
    if (dbCategories.length > 0) {
      return dbCategories;
    }

    // Otherwise return fallback categories
    return BOOK_CATEGORIES;
  } catch (error) {
    console.error("Error fetching categories from DB:", error);
    // Return fallback on error
    return BOOK_CATEGORIES;
  }
}

// Get categories with book counts
export async function getCategoriesWithCounts() {
  try {
    // Get all categories from database
    const result = await db.query(
      `SELECT category, COUNT(*) as count FROM books WHERE category IS NOT NULL AND category != '' GROUP BY category ORDER BY category`,
    );

    const dbCategoriesWithCounts = result.rows;

    // If database has categories, return them
    if (dbCategoriesWithCounts.length > 0) {
      return dbCategoriesWithCounts.map((row) => ({
        name: row.category,
        count: parseInt(row.count),
      }));
    }

    // Otherwise return empty array (no categories with 0 books)
    return [];
  } catch (error) {
    console.error("Error fetching categories with counts:", error);
    return [];
  }
}

export async function isValidCategory(category) {
  try {
    // Check database for existing categories (case-insensitive)
    const result = await db.query(
      `SELECT DISTINCT LOWER(category) as category FROM books WHERE category IS NOT NULL AND category != ''`,
    );
    const dbCategories = result.rows.map((row) => row.category);

    // Also check predefined categories
    const predefinedLower = BOOK_CATEGORIES.map((c) => c.toLowerCase());

    // Valid if in database OR in predefined list
    const categoryLower = category.toLowerCase();
    return (
      dbCategories.includes(categoryLower) ||
      predefinedLower.includes(categoryLower)
    );
  } catch (error) {
    console.error("Error validating category:", error);
    // If error, check predefined as fallback
    return BOOK_CATEGORIES.map((c) => c.toLowerCase()).includes(
      category.toLowerCase(),
    );
  }
}

export function getAvatarColor(username) {
  const colors = [
    "from-pink-500 to-rose-500",
    "from-purple-500 to-indigo-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-yellow-500 to-orange-500",
    "from-red-500 to-pink-500",
    "from-cyan-500 to-blue-500",
    "from-violet-500 to-purple-500",
    "from-fuchsia-500 to-pink-500",
    "from-teal-500 to-cyan-500",
  ];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
