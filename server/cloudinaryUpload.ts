const CLOUD_NAME = 'dxf4xzu7x';
const UPLOAD_PRESET = 'lzarcntm';

export async function uploadImageToCloud(localUri: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', {
    uri: localUri,
    type: 'image/jpeg',
    name: 'note_image.jpg',
  } as any);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  const data = await res.json();
  return data.secure_url; // This is the public URL
}