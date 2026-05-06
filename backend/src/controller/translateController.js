import { textToSpeech } from '../services/tts.js';

export const translateText = async (req, res) => {
    const text = req.body.text;
    const targetLang = req.body.targetLang;

    try {
        const translatedText = await placeholder.translate(text, targetLang);
        const speechRecording = await textToSpeech(translatedText);
        res.setHeader('Content-Type', 'audio/mpeg');
        
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
}