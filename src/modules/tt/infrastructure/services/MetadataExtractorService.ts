import { OpenAI } from "openai";
import pdfParse from "pdf-parse";
import fs from "fs";

// Configurar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export class MetadataExtractorService {
  // Método para generar metadata desde un archivo PDF
  async generarMetadata(pdfFile: Buffer | string): Promise<any> {
    try {
      // Leer el contenido del archivo PDF
      const pdfBuffer =
        typeof pdfFile === "string" ? fs.readFileSync(pdfFile) : pdfFile;
      const pdfData = await pdfParse(pdfBuffer);

      // Limitar el texto a un máximo de 5000 caracteres
      const maxChars = 5000;
      const limitedText = pdfData.text.slice(0, maxChars);

      // Crear el prompt para OpenAI
      const prompt = `
      A continuación tienes el texto completo de un documento académico. Extrae la metadata en formato JSON sin incluir delimitadores de código ni texto adicional:
      - "titulo": El título del documento.
      - "autores": Un arreglo de objetos con "nombreCompleto" y opcionalmente "orcid" este solo si esta mencionado.
      - "palabrasClave": Una lista de palabras clave (máximo 5).
      - "unidadAcademica": La unidad académica asociada (solo la escuela).
      - "directores": Un arreglo de objetos con "nombreCompleto" y opcionalmente "orcid".
      - "grado": El grado académico relacionado (Maestría, Licenciatura, Doctorado).
      - "resumen": Un breve resumen del documento (minimo de 100 palabras pero que este bien descrito) (es lo más importante ya que se usará para luego crear embeddings).
      - "fechaPublicacion": La fecha de publicación (si está disponible y en año unicamente, es decir, numero de 4 dígitos).
      Texto del documento:
      ---
      ${limitedText}
      ---
      `;
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Eres un modelo que extrae metadata académica.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 3000,
      });

      let metadata = {
        titulo: "",
        autores: [],
        palabrasClave: [],
        unidadAcademica: "",
        directores: [],
        grado: "",
        resumen: "",
        fechaPublicacion: "",
      };

      if (response.choices[0].message?.content) {
        const responseContent = response.choices[0].message.content.trim();
        const jsonResponse = responseContent.replace(/json|/g, "").trim();

        try {
          const parsedMetadata = JSON.parse(jsonResponse);
          metadata = { ...metadata, ...parsedMetadata };
        } catch (error) {
          console.error("Error al parsear JSON:", error);
        }
      }

      return metadata;
    } catch (error) {
      console.error("Error al generar metadata:", error);
      throw error;
    }
  }
}
