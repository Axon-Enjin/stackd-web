import { supabaseAdminClient } from "@/lib/supabase";
import { ICertificationRepository } from "../domain/ICertificationRepository";
import { Certification, CertificationProps } from "../domain/Certification";
import { Tables, TablesInsert } from "@/types/supabase.types";
// Adjust this import path to wherever your Database type is exported

type TeamMemberRow = Tables<{ schema: "client_stackd" }, "team_member">;
type TeamMemberInsert = TablesInsert<
  { schema: "client_stackd" },
  "team_member"
>;
supabaseAdminClient;

export class MemberRepository implements ICertificationRepository {
  private readonly TABLE_NAME = "team_member";

  // Maps Domain Model -> Database Insert/Update Model
  private toDb(props: CertificationProps): TeamMemberInsert {
    return {
      id: props.id,
      first_name: props.title,
      last_name: props.description,
      middle_name: props.middleName || null,
      image_url: props.image_url,
      bio: props.bio,
      role: props.role,
      ranking_index: props.rankingIndex,
      updated_at: new Date().toISOString(), // Required by your Supabase Insert type
    };
  }

  // Maps Database Row -> Domain Model
  private toDomain(row: TeamMemberRow): CertificationProps {
    return {
      id: row.id,
      title: row.first_name,
      description: row.last_name,
      middleName: row.middle_name || undefined,
      image_url: row.image_url,
      bio: row.bio,
      role: row.role,
      rankingIndex: row.ranking_index,
    };
  }

  async saveNewMember(member: Certification): Promise<Certification> {
    const { data, error } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .insert(this.toDb(member.props))
      .select()
      .single();

    if (error) throw new Error(`Failed to save member: ${error.message}`);
    return Certification.hydrate(this.toDomain(data));
  }

  async persisUpdates(member: Certification): Promise<Certification> {
    const { data, error } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .update(this.toDb(member.props))
      .eq("id", member.props.id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update member: ${error.message}`);
    return Certification.hydrate(this.toDomain(data));
  }

  async deleteById(id: string): Promise<boolean> {
    const { error } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .delete()
      .eq("id", id);

    if (error) throw new Error(`Failed to delete member: ${error.message}`);
    return true;
  }

  async findById(id: string): Promise<Certification | null> {
    const { data, error } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(`Failed to find member: ${error.message}`);
    if (!data) return null;

    return Certification.hydrate(this.toDomain(data));
  }

  async listPaginated(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Certification[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .select("*", { count: "exact" })
      .order("ranking_index", { ascending: true }) // Fixed: Use DB column name, not camelCase
      .range(from, to);

    if (error) throw new Error(`Failed to list members: ${error.message}`);

    return {
      list: (data || []).map((item) => Certification.hydrate(this.toDomain(item))),
      count: count || 0,
    };
  }
}
