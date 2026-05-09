import { ElevenLabsClient, play } from '@elevenlabs/elevenlabs-js';
import 'dotenv/config';

export const textToSpeech = async (text) => {
    const elevenlabs = new ElevenLabsClient();
    const audio = await elevenlabs.textToSpeech.convert(
    'JBFqnCBsd6RMkjVDRZzb',
    {
        text: text,
        modelId: 'eleven_v3',
        outputFormat: 'mp3_44100_128',
        language_code: 'th',
    }
    );
    
    const chunks = [];
    for await (const chunk of audio) {
        chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return buffer.toString('base64');
}


