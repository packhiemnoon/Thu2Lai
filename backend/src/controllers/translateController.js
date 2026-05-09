import { textToSpeech } from '../services/tts.js';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const translateText = async (req, res) => {
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: "No text provided" });

    try {
        let finalOutput = text;
        finalOutput = await new Promise((resolve, reject) => {
            const pythonProcess = spawn('python', [path.join(__dirname, '../bridge.py')], {
cwd: path.join(__dirname, '..')
});
            let result = "";

            pythonProcess.on('error', (err) => { console.error('spawn error:', err); });
            pythonProcess.on('close', (code) => { console.log('exit code:', code); });

            pythonProcess.stdin.write(JSON.stringify({ text }) + "\n");
            pythonProcess.stdin.end();

            pythonProcess.stdout.on('data', (data) => { result += data.toString(); });
            pythonProcess.stdout.on('end', () => {
                try {
                    console.log('raw result:', result);
                    const json = JSON.parse(result);
                    json.success ? resolve(json.result) : reject(json.error);
                } catch (e) { reject(new Error("Python parse error: " + e.message)); }
            });
        });
        const soundRecording = await textToSpeech(finalOutput);
        return res.json({ text: finalOutput, sound: soundRecording });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};