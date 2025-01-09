import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/**
 * Servicio que maneja la generación de embeddings usando la API de OpenAI (o GPT).
 */
export class EmbeddingService {
  private openAiKey: string;
  private model: string;

  constructor() {
    this.openAiKey = process.env.OPENAI_API_KEY || ""; // Asegúrate de setear esto en .env
    this.model = "text-embedding-ada-002"; // Modelo por defecto
  }

  /**
   * Generar el embedding a partir de un texto (resumen).
   * @param text Texto para el cual generamos el embedding.
   */
  public async generateEmbedding(text: string): Promise<number[] | null> {
    if (!this.openAiKey) {
      console.error("No se encontró la clave OPENAI_API_KEY en .env");
      return null;
    }
    console.log("Generando embedding para:", text);
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/embeddings",
        {
          input: text,
          model: this.model,
        },
        {
          headers: {
            Authorization: `Bearer ${this.openAiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const embedding = response.data.data[0].embedding;
        return embedding;
      } else {
        console.error(
          `No se pudo recibir el embedding. Status: ${response.status}`
        );
        return null;
      }
    } catch (error: any) {
      console.error(
        "Error al generar el embedding:",
        error.response?.data || error.message
      );
      return null;
    }
  }
}
