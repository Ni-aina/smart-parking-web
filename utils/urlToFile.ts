export async function urlToFile(url: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();

  const urlParts = url.split("/");
  const lastPart = urlParts[urlParts.length - 1];
  const [filename, extension] = lastPart.split(".");

  const fileName = extension ? `${filename}.${extension}` : "image.jpg";
    
  const file = new File([blob], fileName, { type: blob.type });
  return file;
}
