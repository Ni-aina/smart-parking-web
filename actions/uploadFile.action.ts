import { getServerAuth } from "./authServer.action";

export async function uploadFile(
  file: File,
  bucket: string,
  folder?: string
): Promise<string | null> {
  try {
    
    const { supabase } = await getServerAuth();

    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw new Error(`${error.message}`);

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return data.publicUrl;
  } catch (err) {
    console.error(err);
    return null;
  }
}