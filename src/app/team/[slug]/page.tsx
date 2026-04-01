import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { teamMembersModuleController } from "@/features/TeamMembers/TeamMembersModule";
import { siteConfig } from "@/configs/seo";
import { TeamMemberContent } from "./TeamMemberContent";

// ── Types ────────────────────────────────────────────────────────────────────

interface Params {
  slug: string;
}

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

// ── Static generation: pre-render all known team slugs at build time ─────────
// This makes each /team/[slug] page statically generated (SSG) rather than
// server-rendered on every request, giving Googlebot instant HTML with no JS.

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const members = await teamMembersModuleController.listAllMembers();
    return members.map((m) => ({
      slug: `${m.firstName}-${m.lastName}`.toLowerCase().replace(/\s+/g, "-"),
    }));
  } catch {
    return [];
  }
}

// ── Dynamic metadata: gives each member their own title + OG in <head> ───────
// Before this fix, Googlebot saw NO title or description on these pages.

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const member = await teamMembersModuleController.getMemberByName(slug);
    const fullName = getFullName(member);

    return {
      title: `${fullName} — ${member.role}`,
      description: member.bio
        ? member.bio.slice(0, 155).replace(/\s+\S*$/, "") + "…"
        : `${fullName} is ${member.role} at Stackd.`,
      alternates: {
        canonical: `/team/${slug}`,
      },
      openGraph: {
        title: `${fullName} | Stackd`,
        description: member.bio?.slice(0, 120) ?? `${member.role} at Stackd`,
        url: `${siteConfig.url}/team/${slug}`,
        type: "profile",
        images: member.imageUrl512
          ? [{ url: member.imageUrl512, width: 512, height: 640, alt: fullName }]
          : [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: fullName }],
      },
      twitter: {
        card: "summary",
        title: `${fullName} | Stackd`,
        description: member.bio?.slice(0, 120) ?? `${member.role} at Stackd`,
        images: member.imageUrl512 ? [member.imageUrl512] : [siteConfig.ogImage],
      },
    };
  } catch {
    return {
      title: "Team Member",
      description: "Meet the Stackd team.",
    };
  }
}

// ── Page (Server Component) ──────────────────────────────────────────────────
// Data is fetched server-side — Googlebot gets full HTML including name, role,
// and bio without needing to execute JavaScript.

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  let member: Awaited<
    ReturnType<typeof teamMembersModuleController.getMemberByName>
  >;

  try {
    member = await teamMembersModuleController.getMemberByName(slug);
  } catch {
    notFound();
  }

  return <TeamMemberContent member={member} slug={slug} />;
}
