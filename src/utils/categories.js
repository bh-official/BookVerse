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
];

export function getCategoryEmoji(category) {
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
  };
  return emojiMap[category] || "📕";
}

export function isValidCategory(category) {
  return BOOK_CATEGORIES.includes(category);
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
