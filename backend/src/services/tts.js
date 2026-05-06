import { ElevenLabsClient, play } from '@elevenlabs/elevenlabs-js';
import 'dotenv/config';

export const textToSpeech = async (text) => {
    const elevenlabs = new ElevenLabsClient();
    const audio = await elevenlabs.textToSpeech.convert(
    'UgBBYS2sOqTuMpoF3BR0', // "Mark"
    {
        text: text,
        modelId: 'eleven_v3',
        outputFormat: 'mp3_44100_128',
        language_code: 'th',
    }
    );
    return audio;
}


