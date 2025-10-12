import { createClient } from "@/lib/supabase/server";

export async function removeFile(
  filePath: string,
  bucket: string
): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) throw new Error(error.message);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}