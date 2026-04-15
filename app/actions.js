"use server";

import { auth } from "@clerk/nextjs/server";
import { supabase } from "../lib/supabase";

export async function getAssignments() {
  const { userId } = await auth();
  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .eq("user_id", userId)
    .order("due_date");
  if (error) throw new Error(error.message);
  return data;
}

export async function addAssignmentAction(fields) {
  const { userId } = await auth();
  const { data, error } = await supabase
    .from("assignments")
    .insert({ ...fields, user_id: userId })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateAssignmentAction(id, updates) {
  const { userId } = await auth();
  const { data, error } = await supabase
    .from("assignments")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
