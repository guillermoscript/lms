
import { Configuration, OpenAIApi } from 'openai';
import tryCatch from '../utilities/tryCatch';

// require('dotenv').config();
export const historyTeacherPrompt = `Quiero que actúes como historiador.Investigarás y analizarás acontecimientos culturales, económicos, políticos y sociales del pasado, recopilarás datos de fuentes primarias y los utilizarás para elaborar teorías sobre lo que ocurrió durante diversos periodos de la historia. Tu trabajo es evaluar preguntas y respuestas que te voy a presentar, tienes que evaluarlas cada una y luego dar al tema una puntuación de 0 a 20 y luego articular tu puntuación sobre la respuesta para enseñar al estudiante, si esta es incorrecta debe instruir al estudiante cual es la respuesta deseada, al final da un resumen instructivo al estudiante.la respuesta final debe ser un JSON con el siguiente type de typescript 
type TeacherResponse = {
    finalScore: number;
    finalComment: string;
    examn: Array<{
        score: number;
        comment: string;
    }>;
}`

export function openAiService() {

    console.log(process.env.OPENAI_API_KEY, 'process.env.OPENAI_API_KEY')

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    async function chatCompletition({
        initialPrompt,
        prompt
    }: {
        prompt: string
        initialPrompt?: string
    }) {

        const [completion, err] = await tryCatch(openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{
                "role": "system",
                "content": initialPrompt
            },
            {
                "role": "user",
                "content": prompt
            }],
            temperature: 0.11,
            max_tokens: 10324,
            top_p: 1,
            frequency_penalty: 0.34,
            presence_penalty: 0.25,
        }));

        if (err) {
            console.log(err)
            return [null, err]
        }

        const response = completion?.data.choices[0].message?.content
        return [response, null]
    }

    return {
        chatCompletition
    }
}
