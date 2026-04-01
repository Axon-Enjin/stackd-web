import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { teamMembersModuleController } from "@/features/TeamMembers/TeamMembersModule";
import { siteConfig } from "@/configs/seo";

// ── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Meet the Team",
  description:
    "Meet the team behind Stackd — revenue operations specialists helping consumer brands build and scale on TikTok Shop.",
  alternates: {
    canonical: "/team",
  },
  openGraph: {
    title: "Meet the Stackd Team",
    description:
      "The specialists behind Stackd's live commerce, creator, and performance systems.",
    url: `${siteConfig.url}/team`,
    type: "website",
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function getFullName(member: {
  firstName: string;
  middleName?: string | null;
  lastName: string;
}) {
  const middle = member.middleName ? `${member.middleName.charAt(0)}.` : "";
  return `${member.firstName} ${middle} ${member.lastName}`
    .replace(/\s+/g, " ")
    .trim();
}

function getSlug(member: { firstName: string; lastName: string }) {
  return `${member.firstName}-${member.lastName}`.toLowerCase().replace(/\s+/g, "-");
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function TeamPage() {
  let members: Awaited<
    ReturnType<typeof teamMembersModuleController.listAllMembers>
  > = [];

  try {
    members = await teamMembersModuleController.listAllMembers();
  } catch {
    members = [];
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F9FC]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-[#0B1F3B] px-6 pt-28 pb-20">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-5 block text-xs font-semibold uppercase tracking-[0.18em] text-[#2FB7A8]">
            Our People
          </span>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Meet the Team
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-white/50">
            The revenue operations specialists behind Stackd's live commerce,
            creator, and performance systems.
          </p>
        </div>
      </section>

      {/* ── Team Grid ── */}
      <main className="mx-auto w-full max-w-5xl grow px-6 py-16">
        {members.length === 0 ? (
          <p className="text-center text-[#1A1A1A]/40">
            Team profiles coming soon.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => {
              const slug = getSlug(member);
              const fullName = getFullName(member);
              return (
                <li key={member.id}>
                  <Link
                    href={`/team/${slug}`}
                    className="group block overflow-hidden rounded-2xl border border-[#E8ECF2] bg-white transition-shadow duration-200 hover:shadow-md"
                  >
                    {/* Avatar */}
                    <div className="aspect-[4/3] w-full overflow-hidden bg-[#0B1F3B]/5">
                      {member.imageUrl ? (
                        <img
                          src={member.imageUrl256 || member.imageUrl}
                          alt={fullName}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0B1F3B]/10 to-[#2F80ED]/10">
                          <span className="text-4xl font-bold text-[#0B1F3B]/20 uppercase">
                            {member.firstName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <p className="mb-0.5 text-base font-bold text-[#0B1F3B]">
                        {fullName}
                      </p>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#2F80ED]">
                        {member.role}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  );
}
