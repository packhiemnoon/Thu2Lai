export const translateText = async (req, res) => {
    const text = req.body.text;
    const targetLang = req.body.targetLang;

    try {
        const translatedText = await placeholder.translate(text, targetLang);
        const speechRecording = await placeholder.tts(translatedText);
        return res.json({text: translatedText, speech: speechRecording});
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
}