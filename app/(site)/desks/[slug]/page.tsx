import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideDetail } from "@/components/guide/GuideDetail";
import { getPublicGuideBySlug, getPublicGuidesByCategory } from "@/lib/public-guides";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { matchSlugsForSilo } from "@/lib/migrated-silos";

export const revalidate = 604800;

type Props = { params: Promise<{ slug: string }> };

const SILO = "desks";
const matchSlugs = matchSlugsForSilo(SILO);

export async function generateStaticParams() {
  const guides = await getPublicGuidesByCategory(SILO, matchSlugs);
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getPublicGuideBySlug(slug);
  if (!guide) return {};

  const heroImage = guide.heroImage?.startsWith("http")
    ? guide.heroImage
    : guide.heroImage?.startsWith("/")
    ? `${SITE_URL}${guide.heroImage}`
    : undefined;

  const base = buildMetadata({
    title: guide.metaTitle ?? guide.title,
    description: guide.metaDescription ?? guide.description,
    path: `/desks/${slug}`,
    image: heroImage,
    type: "article",
  });

  return {
    ...base,
    keywords: [guide.mainKeyword, ...guide.subKeywords],
    openGraph: {
      ...(base.openGraph as object),
      type: "article",
      publishedTime: guide.lastUpdated,
      modifiedTime: guide.lastUpdated,
      authors: [guide.author],
      section: guide.subcategorySlug.replace(/-/g, " "),
    },
  };
}

export default async function DesksGuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = await getPublicGuideBySlug(slug);
  if (!guide) notFound();

  // Guard: a guide only renders under /desks if it actually belongs to the
  // migrated Desks category/subcategories — anything else 404s here rather
  // than silently rendering unrelated content at a desks URL.
  if (!matchSlugs.includes(guide.categorySlug) && !matchSlugs.includes(guide.subcategorySlug)) {
    notFound();
  }

  return <GuideDetail slug={slug} basePath="/desks" sectionLabel="Desks" sectionHref="/desks" />;
}
