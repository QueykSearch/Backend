import { Storage, GetSignedUrlConfig } from "@google-cloud/storage";
import dotenv from "dotenv";
dotenv.config();

/**
 * Servicio que maneja la subida de archivos a Google Cloud Storage.
 */

const keyFilename = process.env.GCLOUD_KEYFILE || "key.json";
const bucketName = process.env.GCLOUD_BUCKET || "trabajosterminales";
const storage = new Storage({ keyFilename });

export class GoogleCloudStorageService {
  private bucket = storage.bucket(bucketName);

  public async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = file.originalname;
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
        // Generar la URL pública o firmada (en este caso, preferimos Signed URL o
        // simplemente almacenar "fileName" en DB y generarla después al descargar)
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });
  }

  /**
   * Generar una URL firmada para descargar un archivo.
   * @param fileName Nombre del archivo en el bucket
   * @param expiresInMs default 5 minutos
   */
  public async getSignedUrl(
    fileName: string,
    expiresInMs: number = 1000 * 60 * 5
  ): Promise<string> {
    const file = this.bucket.file(fileName);
    const exists = await file.exists();
    if (!exists[0]) {
      throw new Error("File not found in GCS");
    }

    const options: GetSignedUrlConfig = {
      action: "read",
      expires: Date.now() + expiresInMs,
    };

    const [signedUrl] = await file.getSignedUrl(options);
    return signedUrl;
  }

  /**
   * (Opcional) Eliminar un archivo del bucket
   */
  public async deleteFile(fileName: string): Promise<void> {
    const file = this.bucket.file(fileName);
    await file.delete();
  }
}
