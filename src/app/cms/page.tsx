"use client";

import Link from "next/link";
import { Users, Award, MessageSquareQuote, ArrowRight } from "lucide-react";

const SECTIONS = [
  {
    title: "Team Members",
    description: "Manage your team directory — add, edit, or remove members.",
    href: "/cms/team-members",
    icon: Users,
    gradient: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    title: "Certifications",
    description:
      "Showcase professional and technical certifications.",
    href: "/cms/certifications",
    icon: Award,
    gradient: "from-violet-500 to-purple-600",
    bgLight: "bg-violet-50",
    textColor: "text-violet-600",
  },
  {
    title: "Testimonials",
    description:
      "Curate client feedback, quotes, and success stories.",
    href: "/cms/testimonials",
    icon: MessageSquareQuote,
    gradient: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
];

export default function CMSDashboardPage() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-500">
          Welcome back. Manage your site content from here.
        </p>
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Icon */}
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${section.bgLight}`}
              >
                <Icon size={24} className={section.textColor} />
              </div>

              {/* Content */}
              <h2 className="mb-1 text-lg font-bold text-gray-900">
                {section.title}
              </h2>
              <p className="mb-4 flex-grow text-sm leading-relaxed text-gray-500">
                {section.description}
              </p>

              {/* Action link */}
              <div
                className={`flex items-center gap-1.5 text-sm font-semibold ${section.textColor}`}
              >
                Manage
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </div>

              {/* Decorative gradient bar at top */}
              <div
                className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${section.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
