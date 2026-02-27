import { IAuthRepository } from "../domain/IAuthRepository";
import { User, UserRole } from "../domain/User";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export class SupabaseAuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<User> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("No user returned after login.");
    }

    return this.mapSupabaseUserToDomainUser(
      data.user,
      data.session?.access_token,
    );
  }

  async logout(): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  async getSession(): Promise<User | null> {
    const supabase = await createSupabaseServerClient();

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session || !session.user) {
      return null;
    }

    return this.mapSupabaseUserToDomainUser(session.user, session.access_token);
  }

  private async mapSupabaseUserToDomainUser(
    supabaseUser: any,
    jwt?: string,
  ): Promise<User> {
    let role: UserRole = "user";

    try {
      const supabase = await createSupabaseServerClient();

      // The generated Database types now reflect the "users" table correctly.
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", supabaseUser.id)
        .single();

      if (profile && profile.role) {
        role = profile.role as UserRole;
      }
    } catch (err) {
      console.error("Failed to fetch role from DB:", err);
      role = "user"; // fallback to default user role if not found or errored
    }

    return new User(supabaseUser.id, supabaseUser.email, role);
  }
}
