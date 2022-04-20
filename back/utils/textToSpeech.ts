import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import util from 'util';
import { FILES_PATH } from './config';

// Creates a client
const client = new textToSpeech.TextToSpeechClient({
  projectId: 'taskmaster-314718',
  keyFilename: FILES_PATH + '/service-account.json',
});

export const speak = async (text: string, roomId: string) => {
  try {
    console.log('Text-to-speech:', text);

    // Construct the request
    const request = {
      input: { text },
      // Select the language and SSML voice gender (optional)
      voice: { languageCode: 'fi', ssmlGender: 'male' },
      // select the type of audio encoding
      audioConfig: { audioEncoding: 'MP3' },
    };

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request as any);

    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);

    const filePath = `${FILES_PATH}/audio/output-${roomId}.mp3`;
    console.log('Saving file to:', filePath);

    await writeFile(filePath, response.audioContent as Uint8Array, 'binary');

    return [filePath, response.audioContent] as const;
  } catch (err) {
    console.error('> Generating audio file failed:', err);
  }
};
