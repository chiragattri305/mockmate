export default function sitemap() {
  const baseUrl = "https://mockmate-ten-lac.vercel.app";

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
