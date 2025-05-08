"use server";

import { redirect } from "next/navigation";
import { createClient } from "./server";
import { revalidatePath } from "next/cache";
import { SupabaseClient } from "@supabase/supabase-js";

export async function emailLogin(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/todos");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

export async function googleAuth() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function isAuthenticated() {
  const user = await getUser();
  return !!user;
}

export async function isAuthenticatedOrRedirect(path: string = "/login") {
  const user = await getUser();
  if (!user) {
    redirect(path);
  }
  return user;
}

export async function getUser(supabase?: SupabaseClient) {
  if (!supabase) {
    supabase = await createClient();
  }
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return null;
  }
  return data.user;
}
