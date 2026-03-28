import { createSupabaseServerClient, createSupabaseAnonymousClient } from "@/lib/supabase/server";
import { IMemberRepository } from "../domain/IMemberRepository";
import { Member, MemberProps } from "../domain/Member";
import { Tables, TablesInsert } from "@/types/supabase.types";
import { toTeamSlug } from "@/lib/utils";
import { unstable_cache } from "next/cache";

type TeamMemberRow = Tables<{ schema: "client_stackd" }, "team_member">;
type TeamMemberInsert = TablesInsert<
  { schema: "client_stackd" },
  "team_member"
>;

export class MemberRepository implements IMemberRepository {
  private readonly TABLE_NAME = "team_member";

  // Maps Domain Model -> Database Insert/Update Model
  private toDb(props: MemberProps): TeamMemberInsert {
    return {
      id: props.id,
      first_name: props.firstName,
      last_name: props.lastName,
      middle_name: props.middleName || null,
      image_url: props.image_url,
      image_url_64: props.image_url_64 || null,
      image_url_256: props.image_url_256 || null,
      image_url_512: props.image_url_512 || null,
      bio: props.bio,
      role: props.role,
      ranking_index: props.rankingIndex,
      linkedinUrl: props.linkedinProfile || null,
      achievements: props.achievements ?? [],
      updated_at: new Date().toISOString(), // Required by your Supabase Insert type
    };
  }

  // Maps Database Row -> Domain Model
  private toDomain(row: TeamMemberRow): MemberProps {
    return {
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      middleName: row.middle_name || undefined,
      image_url: row.image_url,
      image_url_64: row.image_url_64 || undefined,
      image_url_256: row.image_url_256 || undefined,
      image_url_512: row.image_url_512 || undefined,
      bio: row.bio,
      role: row.role,
      rankingIndex: row.ranking_index,
      achievements: row.achievements as string[] || [],
      linkedinProfile: row.linkedinUrl || undefined,
    };
  }

  async saveNewMember(member: Member): Promise<Member> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert(this.toDb(member.props))
      .select()
      .single();

    if (error) throw new Error(`Failed to save member: ${error.message}`);
    return Member.hydrate(this.toDomain(data));
  }

  async persistUpdates(member: Member): Promise<Member> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(this.toDb(member.props))
      .eq("id", member.props.id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update member: ${error.message}`);
    return Member.hydrate(this.toDomain(data));
  }

  async deleteById(id: string): Promise<boolean> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq("id", id);

    if (error) throw new Error(`Failed to delete member: ${error.message}`);
    return true;
  }

  async findById(id: string): Promise<Member | null> {
    const fetchMember = unstable_cache(
      async (id: string) => {
        const supabase = createSupabaseAnonymousClient();
        const { data, error } = await supabase
          .from(this.TABLE_NAME)
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) throw new Error(`Failed to find member: ${error.message}`);
        return data;
      },
      [`member-${id}`],
      { revalidate: 3600, tags: ["team-members"] }
    );

    const data = await fetchMember(id);
    if (!data) return null;
    return Member.hydrate(this.toDomain(data));
  }

  async findByName(name: string): Promise<Member | null> {
    // Uses the cached listAll internally
    const allMembers = await this.listAll();
    const found = allMembers.find(
      (m) => toTeamSlug(m.props.firstName, m.props.lastName) === name
    );
    return found || null;
  }

  async listPaginated(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Member[]; count: number }> {
    const fetchPaginated = unstable_cache(
      async (page: number, size: number) => {
        console.log(`[MemberRepository] ⚡ FETCHING FROM DATABASE: Page ${page}`);
        const from = (page - 1) * size;
        const to = from + size - 1;

        const supabase = createSupabaseAnonymousClient();
        const { data, error, count } = await supabase
          .from(this.TABLE_NAME)
          .select("*", { count: "exact" })
          .order("ranking_index", { ascending: true })
          .range(from, to);

        if (error) throw new Error(`Failed to list members: ${error.message}`);
        return { data: data || [], count: count || 0 };
      },
      [`members-page-${pageNumber}-${pageSize}`],
      { revalidate: 3600, tags: ["team-members"] }
    );

    const { data, count } = await fetchPaginated(pageNumber, pageSize);
    return {
      list: data.map((item) => Member.hydrate(this.toDomain(item))),
      count,
    };
  }

  async listAll(): Promise<Member[]> {
    const fetchAll = unstable_cache(
      async () => {
        console.log(`[MemberRepository] ⚡ FETCHING ALL FROM DATABASE`);
        const supabase = createSupabaseAnonymousClient();
        const { data, error } = await supabase
          .from(this.TABLE_NAME)
          .select("*")
          .order("ranking_index", { ascending: true });

        if (error) throw new Error(`Failed to list all members: ${error.message}`);
        return data || [];
      },
      ["members-all"],
      { revalidate: 3600, tags: ["team-members"] }
    );

    const data = await fetchAll();
    return data.map((item) => Member.hydrate(this.toDomain(item)));
  }

  async countAll(): Promise<number> {
    const fetchCount = unstable_cache(
      async () => {
        const supabase = createSupabaseAnonymousClient();
        const { count, error } = await supabase
          .from(this.TABLE_NAME)
          .select("*", { count: "exact", head: true });

        if (error) throw new Error(`Failed to count team members: ${error.message}`);
        return count || 0;
      },
      ["members-count"],
      { revalidate: 3600, tags: ["team-members"] }
    );

    return await fetchCount();
  }
}
