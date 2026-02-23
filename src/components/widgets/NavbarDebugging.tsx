import Link from "next/link";
import React from "react";

export const NavbarDebugging = () => {
  return (
    <>
      <div className="sticky top-0 flex w-full flex-row gap-4 bg-white/20 px-8 py-8 text-xl shadow-sm shadow-black backdrop-blur-xl">
        {Object.entries(LINKS).map(([key, value]) => (
          <Link key={key} href={value}>
            {key}
          </Link>
        ))}
      </div>
    </>
  );
};

export const LINKS = {
  Home: "/",
  "api testing": "/api-testing",
  "cms:team member": "/cms/team-members",
  "cms:certifications": "/cms/certifications",
  "cms:testimonials": "/cms/testimonials",
};
