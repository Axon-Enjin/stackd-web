import { supabaseAdminClient } from "@/lib/supabase";
import { ITestimonialRepository } from "../domain/ITestimonialRepository";
import { Testimonial, TestimonialProps } from "../domain/Testimonial";
import { Tables, TablesInsert } from "@/types/supabase.types";
// Adjust this import path to wherever your Database type is exported

type TestimonialRow = Tables<{ schema: "client_stackd" }, "testimonial">;
type TestimonialInsert = TablesInsert<
  { schema: "client_stackd" },
  "testimonial"
>;
supabaseAdminClient;

export class TestimonialRepository implements ITestimonialRepository {
  private readonly TABLE_NAME = "testimonial";

  // Maps Domain Model -> Database Insert/Update Model
  private toDb(props: TestimonialProps): TestimonialInsert {
    return {
      id: props.id,
      title: props.title,
      description: props.description,
      body: props.body,
      image_url: props.image_url,
      ranking_index: props.rankingIndex,
      updated_at: new Date().toISOString(), // Required by your Supabase Insert type
    };
  }

  // Maps Database Row -> Domain Model
  private toDomain(row: TestimonialRow): TestimonialProps {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      body: row.body,
      image_url: row.image_url,
      rankingIndex: row.ranking_index,
    };
  }

  async saveNew(
    testimonial: Testimonial,
  ): Promise<Testimonial> {
    const { data, error } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .insert(this.toDb(testimonial.props))
      .select()
      .single();

    if (error)
      throw new Error(`Failed to save testimonial: ${error.message}`);
    return Testimonial.hydrate(this.toDomain(data));
  }

  async persistUpdates(testimonial: Testimonial): Promise<Testimonial> {
    const { data, error } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .update(this.toDb(testimonial.props))
      .eq("id", testimonial.props.id)
      .select()
      .single();

    if (error)
      throw new Error(`Failed to update testimonial: ${error.message}`);
    return Testimonial.hydrate(this.toDomain(data));
  }

  async deleteById(id: string): Promise<boolean> {
    const { error } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .delete()
      .eq("id", id);

    if (error)
      throw new Error(`Failed to delete testimonial: ${error.message}`);
    return true;
  }

  async findById(id: string): Promise<Testimonial | null> {
    const { data, error } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error)
      throw new Error(`Failed to find testimonial: ${error.message}`);
    if (!data) return null;

    return Testimonial.hydrate(this.toDomain(data));
  }

  async listPaginated(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Testimonial[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .select("*", { count: "exact" })
      .order("ranking_index", { ascending: true }) // Fixed: Use DB column name, not camelCase
      .range(from, to);

    if (error)
      throw new Error(`Failed to list testimonial: ${error.message}`);

    return {
      list: (data || []).map((item) =>
        Testimonial.hydrate(this.toDomain(item)),
      ),
      count: count || 0,
    };
  }
}
