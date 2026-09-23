import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { silos, type Silo } from "@/data/silos";

// Shared scaffold for the six topic-first top-level silos
// (/workspace-ideas, /desks, /chairs, /lighting, /desk-setup, /work-better).
// Each silo's page.tsx renders this with its own copy; guide/review/comparison
// content gets wired in separately once it's migrated into each silo.
export function SiloHub({ silo }: { silo: Silo }) {
  const otherSilos = silos.filter((s) => s.slug !== silo.slug);

  return (
    <Container className="py-10">
      <Breadcrumbs crumbs={[{ label: silo.name }]} />

      <div className="mt-6 mb-14 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          {silo.name}
        </h1>
        <p className="mt-2 text-lg text-ink-secondary">{silo.tagline}</p>
        <p className="mt-4 text-sm text-ink-secondary leading-relaxed">
          {silo.description}
        </p>
      </div>

      <section className="mb-14">
        <div className="rounded-card border border-dashed border-border bg-bg p-8 text-center">
          <p className="text-sm text-ink-muted">
            Guides for this section are being organized here. Check back soon.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-ink mb-4 tracking-tight">
          Explore Other Topics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherSilos.map((s) => (
            <Link
              prefetch={false}
              key={s.slug}
              href={`/${s.slug}`}
              className="group flex flex-col p-4 bg-white rounded-card border border-border hover:border-brand/30 hover:shadow-card transition-all"
            >
              <span className="font-semibold text-ink text-sm group-hover:text-brand transition-colors">
                {s.name}
              </span>
              <span className="text-xs text-ink-muted mt-0.5">{s.tagline}</span>
            </Link>
          ))}
        </div>
      </section>
    </Container>
  );
}
