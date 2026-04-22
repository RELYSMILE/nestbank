export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "my_unsigned_preset");

  formData.append("folder", "uploads");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dm0cdlj1f/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  
  const data = await res.json();
  console.log(data); 
  return data.secure_url;

};