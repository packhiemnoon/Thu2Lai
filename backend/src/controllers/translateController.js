import { textToSpeech } from '#services/tts';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const translateText = async (req, res) => {
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: "No text provided" });

    if (text.length > 100) {
        return res.status(400).json({ message: "Input text is too long (max 100 characters)." });
    }

    // Regex for Thai characters, Thai numbers, digits, spaces, and common punctuation
    // Ranges: \u0e00-\u0e7f (Thai)
    const thaiRegex = /^[ก-ฮะ-์๐-๙0-9\s\.,!?\(\)\-\+]+$/;
    if (!thaiRegex.test(text)) {
        return res.status(400).json({ message: "Input must contain only Thai characters, numbers, and punctuation." });
    }

    try {
        let finalOutput = text;
        finalOutput = await new Promise((resolve, reject) => {
            const projectRoot = path.join(__dirname, '..', '..');
            let pythonPath = process.env.PYTHON_PATH || (process.platform === 'win32' ? 'python' : 'python3');

            // If pythonPath is relative, resolve it from the project root
            if (pythonPath.startsWith('./') || pythonPath.startsWith('../')) {
                pythonPath = path.resolve(projectRoot, pythonPath);
            }

            const scriptPath = path.join(__dirname, '../bridge.py');

            const pythonProcess = spawn(pythonPath, [scriptPath], {
                cwd: path.join(__dirname, '..')
            });
            let result = "";

            pythonProcess.on('error', (err) => { console.error('spawn error:', err); });
            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error('Python process exited with code:', code);
                }
            });

            pythonProcess.stdin.write(JSON.stringify({ text }) + "\n");
            pythonProcess.stdin.end();

            let stderr = "";
            pythonProcess.stderr.on('data', (data) => { stderr += data.toString(); });

            pythonProcess.stdout.on('data', (data) => { result += data.toString(); });
            pythonProcess.stdout.on('end', () => {
                if (stderr) {
                    console.error('Python stderr:', stderr);
                }
                try {
                    console.log('raw result:', result);
                    const json = JSON.parse(result);
                    json.success ? resolve(json.result) : reject(json.error);
                } catch (e) {
                    const errorMsg = stderr ? `Python error: ${stderr}` : `Python parse error: ${e.message}. Raw output: ${result}`;
                    reject(new Error(errorMsg));
                }
            });
        });
        const soundRecording = await textToSpeech(finalOutput);
        return res.json({ text: finalOutput, sound: soundRecording });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};