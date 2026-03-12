import { MetadataRoute } from "next";
import { getCategories } from "@/lib/apps";

const BASE_URL = "https://www.webapp-picks.cc";

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = getCategories();
  const categoryIds = categories.map((c) => c.value);

  const staticPages = [
    { url: `${BASE_URL}/zh`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${BASE_URL}/en`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${BASE_URL}/zh/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/en/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
  ];

  const categoryPages: MetadataRoute.Sitemap = [];

  for (const lang of ["zh", "en"]) {
    for (const categoryId of categoryIds) {
      categoryPages.push({
        url: `${BASE_URL}/${lang}?category=${categoryId}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      });
    }

    categoryPages.push(
      {
        url: `${BASE_URL}/${lang}?pwa=true`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      },
      {
        url: `${BASE_URL}/${lang}?selfhosted=true`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }
    );
  }

  return [...staticPages, ...categoryPages];
}
