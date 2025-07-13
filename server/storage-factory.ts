import { IStorage } from "./storage";
import { MemStorage } from "./storage";
import { SupabaseStorage } from "./supabase-storage";

export function createStorage(): IStorage {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseKey) {
    console.log("🚀 Using Supabase storage");
    return new SupabaseStorage();
  } else {
    console.log("📝 Using in-memory storage (add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to use Supabase)");
    return new MemStorage();
  }
}

export const storage = createStorage();