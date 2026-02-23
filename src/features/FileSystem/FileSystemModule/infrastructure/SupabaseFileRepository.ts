import { supabaseAdminClient } from "@/lib/supabase";
import {
  FileRecord,
  FileRecordPrototype,
  FileRecordPrototypeProps,
  FileRecordMetadataProps,
} from "../domain/FileRecord";
import { IFileRepository } from "../domain/IFileRepository";

// Helper type to represent the database row structure
type FileRow = FileRecordPrototypeProps & FileRecordMetadataProps;

export class SupabaseFileRepository implements IFileRepository {
  private readonly TABLE_NAME = "files";

  async savePrototype(file: FileRecordPrototype): Promise<FileRecord> {
    const { data, error } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .insert(file.props)
      .select()
      .single();

    if (error) throw new Error(`Failed to save file record: ${error.message}`);
    return FileRecord.hydrate(data as FileRow);
  }

  async findById(id: string): Promise<FileRecord | null> {
    const { data, error } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(`Failed to find file: ${error.message}`);
    return data ? FileRecord.hydrate(data as FileRow) : null;
  }

  async findByPreviewUrl(previewUrl: string): Promise<FileRecord | null> {
    const { data, error } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .select("*")
      .eq("previewUrl", previewUrl)
      .maybeSingle();

    if (error) throw new Error(`Failed to find file by URL: ${error.message}`);
    return data ? FileRecord.hydrate(data as FileRow) : null;
  }

  async saveUpdates(file: FileRecord): Promise<FileRecord> {
    const { data, error } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .update(file.props)
      .eq("id", file.props.id)
      .select()
      .single();

    if (error)
      throw new Error(`Failed to update file record: ${error.message}`);
    return FileRecord.hydrate(data as FileRow);
  }

  async listPaginated(
    page: number,
    pageSize: number,
  ): Promise<{ list: FileRecord[]; count: number }> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .select("*", { count: "exact" })
      .order("createdAt", { ascending: false })
      .range(from, to);

    if (error) throw new Error(`Failed to list files: ${error.message}`);

    return {
      list: (data || []).map((row) => FileRecord.hydrate(row as FileRow)),
      count: count || 0,
    };
  }

  async deleteById(id: string): Promise<boolean> {
    const { error } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .delete()
      .eq("id", id);

    if (error)
      throw new Error(`Failed to delete file record: ${error.message}`);
    return true;
  }
}
