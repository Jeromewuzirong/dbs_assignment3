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

// --- Books ---

export async function searchBooks(query) {
  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`
  );
  if (!res.ok) throw new Error("Failed to search books");
  const json = await res.json();
  return (json.docs || []).map((doc) => ({
    ol_key: doc.key,
    title: doc.title,
    author: (doc.author_name || []).join(", "),
    cover_id: doc.cover_i || null,
    first_publish_year: doc.first_publish_year || null,
  }));
}

export async function getSavedBooks() {
  const { userId } = await auth();
  const { data, error } = await supabase
    .from("saved_books")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function saveBook(book) {
  const { userId } = await auth();
  const { error } = await supabase
    .from("saved_books")
    .insert({
      user_id: userId,
      ol_key: book.ol_key,
      title: book.title,
      author: book.author,
      cover_id: book.cover_id,
      first_publish_year: book.first_publish_year,
    });
  if (error) {
    if (error.code === "23505") return; // already saved
    throw new Error(error.message);
  }
}

export async function removeSavedBook(id) {
  const { userId } = await auth();
  const { error } = await supabase
    .from("saved_books")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
}
