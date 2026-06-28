export default function sitemap() {
  const baseUrl = "https://mockmate.vercel.app"; // Update this with your actual production domain

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    // Add other public pages here if any are created in the future
  ];
}
