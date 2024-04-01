"use server";

import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export async function deletePhoto(public_id) {
  try {
    return await cloudinary.v2.uploader.destroy(public_id);
  } catch (error) {
    console.log(error);
    return { errMessage: error.message };
  }
}

export async function deleteManyPhotos(publicIdsToDelete) {
  try {
    const deleteResponses = await Promise.all(
      publicIdsToDelete.map(async (item) => {
        const public_id = item.id;

        try {
          const result = await cloudinary.v2.uploader.destroy(public_id);
          return { public_id, result };
        } catch (error) {
          console.log(error);
          return { errMessage: error.message };
        }
      })
    );

    return deleteResponses;
  } catch (error) {
    console.log(error);
    return { errMessage: error.message };
  }
}
