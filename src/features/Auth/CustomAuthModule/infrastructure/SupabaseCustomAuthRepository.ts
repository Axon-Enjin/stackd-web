import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ICustomAuthRepository } from "../domain/Interfaces";
import { User, UserProps } from "../domain/User";

export class SupabaseCustomAuthRepository implements ICustomAuthRepository {
  private readonly TABLE_NAME = "user_credentials";

  private toPersistence(user: User) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      password: user.password,
      created_at: user.createdAt,
    };
  }

  private toDomain(row: any): User {
    return User.hydrate({
      id: row.id,
      email: row.email,
      username: row.username,
      password: row.password,
      createdAt: new Date(row.created_at),
    });
  }

  async saveNew(user: User): Promise<User> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from(this.TABLE_NAME).insert(this.toPersistence(user));
    if (error) throw new Error(`Failed to save user: ${error.message}`);
    return user;
  }

  async persistUpdates(user: User): Promise<User> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .update(this.toPersistence(user))
      .eq("id", user.id);
    if (error) throw new Error(`Failed to update user: ${error.message}`);
    return user;
  }

  async deleteByEmail(email: string): Promise<boolean> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from(this.TABLE_NAME).delete().eq("email", email);
    if (error) throw new Error(`Failed to delete user: ${error.message}`);
    return true;
  }

  async findByEmail(email: string): Promise<User | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) return null;
    return this.toDomain(data);
  }

  async findByUsername(username: string): Promise<User | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select("*")
      .eq("username", username)
      .single();

    if (error || !data) return null;
    return this.toDomain(data);
  }
}
