import { createSupabaseServerClient, createSupabaseAnonymousClient } from "@/lib/supabase/server";
import { ITestimonialRepository } from "../domain/ITestimonialRepository";
import { Testimonial, TestimonialProps } from "../domain/Testimonial";
import { Tables, TablesInsert } from "@/types/supabase.types";
import { unstable_cache } from "next/cache";

type TestimonialRow = Tables<{ schema: "client_stackd" }, "testimonial">;
type TestimonialInsert = TablesInsert<
  { schema: "client_stackd" },
  "testimonial"
>;

export class TestimonialRepository implements ITestimonialRepository {
  private readonly TABLE_NAME = "testimonial";

  // Maps Domain Model -> Database Insert/Update Model
  private toDb(props: TestimonialProps): TestimonialInsert {
    return {
      id: props.id,
      name: props.name,
      role: props.role,
      company: props.company || null,
      body: props.body,
      image_url: props.image_url,
      image_url_64: props.image_url_64 || null,
      image_url_256: props.image_url_256 || null,
      image_url_512: props.image_url_512 || null,
      company_logo_url: props.company_logo_url || null,
      company_logo_url_64: props.company_logo_url_64 || null,
      company_logo_url_256: props.company_logo_url_256 || null,
      company_logo_url_512: props.company_logo_url_512 || null,
      ranking_index: props.rankingIndex,
      updated_at: new Date().toISOString(), // Required by your Supabase Insert type
    };
  }

  // Maps Database Row -> Domain Model
  private toDomain(row: TestimonialRow): TestimonialProps {
    return {
      id: row.id,
      name: row.name,
      role: row.role,
      company: row.company || null,
      body: row.body,
      image_url: row.image_url,
      image_url_64: row.image_url_64 || undefined,
      image_url_256: row.image_url_256 || undefined,
      image_url_512: row.image_url_512 || undefined,
      company_logo_url: row.company_logo_url || undefined,
      company_logo_url_64: row.company_logo_url_64 || undefined,
      company_logo_url_256: row.company_logo_url_256 || undefined,
      company_logo_url_512: row.company_logo_url_512 || undefined,
      rankingIndex: row.ranking_index,
    };
  }

  async saveNew(testimonial: Testimonial): Promise<Testimonial> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert(this.toDb(testimonial.props))
      .select()
      .single();

    if (error) throw new Error(`Failed to save testimonial: ${error.message}`);
    return Testimonial.hydrate(this.toDomain(data));
  }

  async persistUpdates(testimonial: Testimonial): Promise<Testimonial> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
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
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq("id", id);

    if (error)
      throw new Error(`Failed to delete testimonial: ${error.message}`);
    return true;
  }

  async findById(id: string): Promise<Testimonial | null> {
    const fetchById = unstable_cache(
      async (id: string) => {
        const supabase = createSupabaseAnonymousClient();
        const { data, error } = await supabase
          .from(this.TABLE_NAME)
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) throw new Error(`Failed to find testimonial: ${error.message}`);
        return data;
      },
      [`testimonial-${id}`],
      { revalidate: 3600, tags: ["testimonials"] }
    );

    const data = await fetchById(id);
    if (!data) return null;
    return Testimonial.hydrate(this.toDomain(data));
  }

  async listPaginated(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Testimonial[]; count: number }> {
    const fetchPaginated = unstable_cache(
      async (page: number, size: number) => {
        const from = (page - 1) * size;
        const to = from + size - 1;

        const supabase = createSupabaseAnonymousClient();
        const { data, error, count } = await supabase
          .from(this.TABLE_NAME)
          .select("*", { count: "exact" })
          .order("ranking_index", { ascending: true })
          .range(from, to);

        if (error) throw new Error(`Failed to list testimonial: ${error.message}`);
        return { data: data || [], count: count || 0 };
      },
      [`testimonials-page-${pageNumber}-${pageSize}`],
      { revalidate: 3600, tags: ["testimonials"] }
    );

    const { data, count } = await fetchPaginated(pageNumber, pageSize);
    return {
      list: data.map((item) => Testimonial.hydrate(this.toDomain(item))),
      count,
    };
  }

  async listAll(): Promise<Testimonial[]> {
    const fetchAll = unstable_cache(
      async () => {
        const supabase = createSupabaseAnonymousClient();
        const { data, error } = await supabase
          .from(this.TABLE_NAME)
          .select("*")
          .order("ranking_index", { ascending: true });

        if (error) throw new Error(`Failed to list all testimonials: ${error.message}`);
        return data || [];
      },
      ["testimonials-all"],
      { revalidate: 3600, tags: ["testimonials"] }
    );

    const data = await fetchAll();
    return data.map((item) => Testimonial.hydrate(this.toDomain(item)));
  }

  async countAll(): Promise<number> {
    const fetchCount = unstable_cache(
      async () => {
        const supabase = createSupabaseAnonymousClient();
        const { count, error } = await supabase
          .from(this.TABLE_NAME)
          .select("*", { count: "exact", head: true });

        if (error) throw new Error(`Failed to count testimonials: ${error.message}`);
        return count || 0;
      },
      ["testimonials-count"],
      { revalidate: 3600, tags: ["testimonials"] }
    );

    return await fetchCount();
  }
}
