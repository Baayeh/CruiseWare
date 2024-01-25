import multer, { Multer } from "multer";
import { v2 } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import "dotenv/config";

v2.config(process.env.CLOUDINARY_URL as string);

const storage = new CloudinaryStorage({
  cloudinary: v2,
});

export const parser: Multer = multer({
  storage,
  limits: {
    fileSize: 5120 * 1024 * 1024,
  },
});
