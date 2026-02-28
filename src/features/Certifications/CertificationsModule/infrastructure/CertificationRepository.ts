import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ICertificationRepository } from "../domain/ICertificationRepository";
import { Certification, CertificationProps } from "../domain/Certification";
import { Tables, TablesInsert } from "@/types/supabase.types";
// Adjust this import path to wherever your Database type is exported

type CertificationRow = Tables<{ schema: "client_stackd" }, "certification">;
type CertificationInsert = TablesInsert<
  { schema: "client_stackd" },
  "certification"
>;

export class CertificationRepository implements ICertificationRepository {
  private readonly TABLE_NAME = "certification";

  // Maps Domain Model -> Database Insert/Update Model
  private toDb(props: CertificationProps): CertificationInsert {
    return {
      id: props.id,
      title: props.title,
      description: props.description,
      image_url: props.image_url,
      ranking_index: props.rankingIndex,
      updated_at: new Date().toISOString(), // Required by your Supabase Insert type
    };
  }

  // Maps Database Row -> Domain Model
  private toDomain(row: CertificationRow): CertificationProps {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      image_url: row.image_url,
      rankingIndex: row.ranking_index,
    };
  }

  async saveNewCertification(
    certification: Certification,
  ): Promise<Certification> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert(this.toDb(certification.props))
      .select()
      .single();

    if (error)
      throw new Error(`Failed to save certification: ${error.message}`);
    return Certification.hydrate(this.toDomain(data));
  }

  async persisUpdates(certification: Certification): Promise<Certification> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(this.toDb(certification.props))
      .eq("id", certification.props.id)
      .select()
      .single();

    if (error)
      throw new Error(`Failed to update certification: ${error.message}`);
    return Certification.hydrate(this.toDomain(data));
  }

  async deleteById(id: string): Promise<boolean> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq("id", id);

    if (error)
      throw new Error(`Failed to delete certification: ${error.message}`);
    return true;
  }

  async findById(id: string): Promise<Certification | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error)
      throw new Error(`Failed to find certification: ${error.message}`);
    if (!data) return null;

    return Certification.hydrate(this.toDomain(data));
  }

  async listPaginated(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Certification[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    const supabase = await createSupabaseServerClient();
    const { data, error, count } = await supabase
      .from(this.TABLE_NAME)
      .select("*", { count: "exact" })
      .order("ranking_index", { ascending: true }) // Fixed: Use DB column name, not camelCase
      .range(from, to);

    if (error)
      throw new Error(`Failed to list certification: ${error.message}`);

    return {
      list: (data || []).map((item) =>
        Certification.hydrate(this.toDomain(item)),
      ),
      count: count || 0,
    };
  }

  async listAll(): Promise<Certification[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select("*")
      .order("ranking_index", { ascending: true });

    if (error)
      throw new Error(`Failed to list all certifications: ${error.message}`);

    return (data || []).map((item) =>
      Certification.hydrate(this.toDomain(item)),
    );
  }
}
