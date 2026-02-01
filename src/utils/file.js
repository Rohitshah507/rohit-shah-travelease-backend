import { v2 as cloudinary } from "cloudinary";

async function uploadFile(files) {
  for (const file of files) {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream((error, data) => {
          if (error) {
            return reject(error);
          }
          return resolve(data);
        })
        .end(file.buffer);
    });
    console.log(result)
  }
}

export default uploadFile;
