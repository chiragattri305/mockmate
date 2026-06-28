// Shared list of quiz topics used by both the /api/quiz route and the Quiz Arena UI.
export const QUIZ_TOPICS = [
  { name: "JavaScript", emoji: "🟨" },
  { name: "React", emoji: "⚛️" },
  { name: "Node.js", emoji: "🟩" },
  { name: "Python", emoji: "🐍" },
  { name: "Data Structures & Algorithms", emoji: "🧩" },
  { name: "System Design", emoji: "🏗️" },
  { name: "SQL & Databases", emoji: "🗄️" },
  { name: "HTML & CSS", emoji: "🎨" },
  { name: "TypeScript", emoji: "🔷" },
  { name: "Operating Systems", emoji: "💻" },
  { name: "Computer Networks", emoji: "🌐" },
  { name: "OOP Concepts", emoji: "🧱" },
  { name: "Git & DevOps", emoji: "🔧" },
  { name: "Java", emoji: "☕" },
  { name: "Behavioral", emoji: "💬" },
];

export const QUIZ_TOPIC_NAMES = QUIZ_TOPICS.map((t) => t.name);
