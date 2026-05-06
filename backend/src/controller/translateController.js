import { textToSpeech } from '../services/tts.js';

export const translateText = async (req, res) => {
    const text = req.body.text;
    const targetLang = req.body.targetLang;
    try {
        //const translatedText = await placeholder.translate(text, targetLang);
        const translatedText = text;
        const soundRecording = await textToSpeech(translatedText); //base64
        return res.json({text: translatedText, sound: soundRecording});
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
}