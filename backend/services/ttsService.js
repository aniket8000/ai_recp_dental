/**
 * services/ttsService.js
 * Lightweight TTS using google-tts-api (returns a playable public URL).
 *
 * For demo this is fine. For production, use a robust TTS provider.
 */

const gtts = require('google-tts-api');

/**
 * synthesizeSpeech(text, lang = 'en')
 * returns a URL (string) that the frontend can play
 */
async function synthesizeSpeech(text, lang = 'en') {
  try {
    if (!text || typeof text !== 'string') text = 'Sorry, I did not understand.';
    const url = gtts.getAudioUrl(text, {
      lang,
      slow: false,
      host: 'https://translate.google.com'
    });
    return url;
  } catch (err) {
    console.error('TTS error:', err.message);
    return null;
  }
}

module.exports = { synthesizeSpeech };
