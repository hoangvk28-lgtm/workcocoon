import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { HeroSection } from "@/components/sections/HeroSection";
import { StartWithYourSpace } from "@/components/sections/StartWithYourSpace";
import { BuildYourCocoon } from "@/components/sections/BuildYourCocoon";
import { FeaturedGuides } from "@/components/sections/FeaturedGuides";
import { CompareTools } from "@/components/sections/CompareTools";
import { DealsSection } from "@/components/sections/DealsSection";
import { HowWeReviewTeaser } from "@/components/sections/HowWeReviewTeaser";
import { NewsletterCTA } from "@/components/sections/NewsletterCTA";
import { AffiliateDisclosureBar } from "@/components/affiliate/AffiliateDisclosureBar";
import { getPublicProducts } from "@/lib/public-products";
import { getRelatedPublicGuides, getFeaturedPublicGuides } from "@/lib/public-guides";
import { getPublicFeaturedDeals } from "@/lib/public-deals";
import { getPublicHomepageSettings, getPublicAffiliateSettings } from "@/lib/public-settings";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: "WorkCocoon — Home Office Ideas, Desk Setup Guides & Product Picks",
  description:
    "Create a calmer, more comfortable home workspace with practical setup guides, thoughtful product recommendations, and home office ideas.",
  path: "/",
});

export default async function HomePage() {
  const [allProducts, homepageSettings, affiliateSettings] = await Promise.all([
    getPublicProducts(),
    getPublicHomepageSettings(),
    getPublicAffiliateSettings(),
  ]);

  const guidesLimit = homepageSettings.sections.guides.limit || 6;
  const curatedSlugs = homepageSettings.sections.guides.featuredSlugs ?? [];

  const [curatedGuides, featuredDeals] = await Promise.all([
    curatedSlugs.length > 0 ? getRelatedPublicGuides(curatedSlugs) : getFeaturedPublicGuides(guidesLimit),
    getPublicFeaturedDeals(),
  ]);
  const popularGuides = curatedGuides.slice(0, guidesLimit);

  // Homepage deals: use featured DB deals with linked products, fallback to budget picks
  const dealProducts = featuredDeals.filter((d) => d.product).map((d) => d.product!).slice(0, 4);
  const editorPicks = dealProducts.length > 0
    ? dealProducts
    : allProducts
        .filter((p) => p.subcategorySlug === "desk-lamps" || p.subcategorySlug === "laptop-stands")
        .sort((a, b) => b.scores.valueForMoney - a.scores.valueForMoney)
        .slice(0, 4);

  const disclosureBannerText =
    affiliateSettings.disclosureBannerText ||
    "We may earn a small commission on qualifying Amazon purchases at no extra cost to you. Recommendations are based on product specs, buyer feedback, and clear comparison criteria.";

  return (
    <>
      {/* ── 1. Hero — brand positioning, no Amazon mention, no score panel ── */}
      <HeroSection settings={homepageSettings} />

      <Container>
        {/* ── 2. Start with your space — problem-first entry points ── */}
        <StartWithYourSpace />

        {/* ── 3. Build Your Cocoon — signature 5-step setup format ── */}
        <BuildYourCocoon />

        {/* ── 4. Popular guides — editorially curated, not latest-first ── */}
        <FeaturedGuides
          guides={popularGuides}
          title={homepageSettings.sections.guides.title}
        />

        {/* ── 5. Compare tools ── */}
        <CompareTools />

        {/* ── 6. Editor picks — small disclosure sits here, not at the top of the page ── */}
        <DealsSection products={editorPicks} />
        <div className="pb-4 -mt-6">
          <AffiliateDisclosureBar variant="banner" disclosureText={disclosureBannerText} />
        </div>
      </Container>

      {/* ── 7. How WorkCocoon chooses products ── */}
      <HowWeReviewTeaser />

      {/* ── 8. The Cocoon newsletter ── */}
      <NewsletterCTA config={homepageSettings.newsletter} />
    </>
  );
}
