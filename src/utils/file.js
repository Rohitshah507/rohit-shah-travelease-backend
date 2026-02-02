import { v2 as cloudinary } from "cloudinary";

const CLOUDINARY_FOLDER = "FYP";
async function uploadFile(files) {
  const uploadedResult = [];

  for (const file of files) {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: CLOUDINARY_FOLDER,
          },
          (error, data) => {
            if (error) {
              return reject(error);
            }
            return resolve(data);
          },
        )
        .end(file.buffer);
    });
    uploadedResult.push(result);
  }
  return uploadedResult;
}

export default uploadFile;
