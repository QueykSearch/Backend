require('dotenv').config();
const axios = require('axios');

async function generateEmbedding(query) {
    const url = 'https://api.openai.com/v1/embeddings';
    const openaiKey = process.env.OPEN_AI_KEY;

    if (!openaiKey) {
        console.error("error api key no encontrada");
        return null;
    }

    try {
        const response = await axios.post(
            url,
            {
                input: query,
                model: "text-embedding-ada-002"
            },
            {
                headers: {
                    Authorization: `Bearer ${openaiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 200) {
            console.log("Se recibioo el embedding ");
            return response.data.data[0].embedding; // Devuelve el embedding
        } else {
            console.error(`no se pudo recibir el emnbedding ${response.status}`);
            return null;
        }
    } catch (err) {
        console.error("eror al general el embedding :", err.response?.data || err.message);
        return null;
    }
}

module.exports = generateEmbedding;
