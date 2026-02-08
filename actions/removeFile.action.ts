import { getServerAuth } from "./authServer.action";

export async function removeFile(
  filePath: string,
  bucket: string
): Promise<boolean> {
  
  try {
    const { supabase } = await getServerAuth();

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