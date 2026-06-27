export async function uploadToCloudinary(
  file: File,
  folder: string,
): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "");

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData },
    );
    const data = await res.json();
    return data.secure_url ?? null;
  } catch {
    return null;
  }
}
