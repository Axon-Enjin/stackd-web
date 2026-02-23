import { supabaseAdminClient } from "@/lib/supabase";
import { IMemberRepository } from "../domain/IMemberRepository";
import { Member, MemberProps } from "../domain/Member";

export class MemberRepository implements IMemberRepository {
  private readonly TABLE_NAME = "members";

  async saveNewMember(member: Member): Promise<Member> {
    const { data, error } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .insert(member.props)
      .select()
      .single();

    if (error) throw new Error(`Failed to save member: ${error.message}`);
    return Member.hydrate(data as MemberProps);
  }

  async persisUpdates(member: Member): Promise<Member> {
    const { data, error } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .update(member.props)
      .eq("id", member.props.id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update member: ${error.message}`);
    return Member.hydrate(data as MemberProps);
  }

  async deleteById(id: string): Promise<boolean> {
    const { error } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .delete()
      .eq("id", id);

    if (error) throw new Error(`Failed to delete member: ${error.message}`);
    return true;
  }

  async findById(id: string): Promise<Member | null> {
    const { data, error } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(`Failed to find member: ${error.message}`);
    if (!data) return null;

    return Member.hydrate(data as MemberProps);
  }

  async listPaginated(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Member[]; count: number }> {
    // Calculate range for Supabase (.range() is inclusive)
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .select("*", { count: "exact" })
      .order("rankingIndex", { ascending: true })
      .range(from, to);

    if (error) throw new Error(`Failed to list members: ${error.message}`);

    return {
      list: (data || []).map((item) => Member.hydrate(item as MemberProps)),
      count: count || 0,
    };
  }
}
