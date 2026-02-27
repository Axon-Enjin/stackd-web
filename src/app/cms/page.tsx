import { redirect } from "next/navigation";

export default function CMSPage() {
  // Directly redirect /cms to a specific dashboard page (e.g., team-members)
  redirect("/cms/team-members");
}
