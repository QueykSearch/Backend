import { Storage } from "@google-cloud/storage";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

/**
 * Servicio que maneja la subida de archivos a Google Cloud Storage.
 */

const keyFilename = process.env.GCLOUD_KEYFILE || "key.json";
const bucketName = process.env.GCLOUD_BUCKET || "trabajosterminales"; // Ajusta a tu bucket
const storage = new Storage({ keyFilename });

export class GoogleCloudStorageService {
  private bucket = storage.bucket(bucketName);

  public async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = Date.now() + "-" + file.originalname;
    const blob = this.bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      blobStream.on("error", (err) => {
        reject(err);
      });

      blobStream.on("finish", async () => {
        // Generar la URL pública o firmada
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });
  }
}
