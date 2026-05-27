/**
 * Converts raw 16-bit little-endian mono PCM audio data into a standard playable WAV file buffer.
 * Gemini 3.1 Flash TTS output is 24000 Hz, 16-bit little-endian PCM, Mono.
 */
export function pcmToWav(pcmBuffer: Buffer, sampleRate: number = 24000): Buffer {
  const wavHeader = Buffer.alloc(44)
  const dataLength = pcmBuffer.length

  // "RIFF" chunk descriptor
  wavHeader.write("RIFF", 0)
  // Chunk size: 36 + subchunk2size
  wavHeader.writeUInt32LE(36 + dataLength, 4)
  // "WAVE" format
  wavHeader.write("WAVE", 8)

  // "fmt " sub-chunk
  wavHeader.write("fmt ", 12)
  // Subchunk1Size: 16 for PCM
  wavHeader.writeUInt32LE(16, 16)
  // AudioFormat: 1 for PCM (linear quantization)
  wavHeader.writeUInt16LE(1, 20)
  // NumChannels: 1 (mono)
  wavHeader.writeUInt16LE(1, 22)
  // SampleRate: 24000 Hz
  wavHeader.writeUInt32LE(sampleRate, 24)
  // ByteRate: SampleRate * NumChannels * BitsPerSample/8 = 24000 * 1 * 2 = 48000
  wavHeader.writeUInt32LE(sampleRate * 2, 28)
  // BlockAlign: NumChannels * BitsPerSample/8 = 2
  wavHeader.writeUInt16LE(2, 32)
  // BitsPerSample: 16 bits
  wavHeader.writeUInt16LE(16, 34)

  // "data" sub-chunk
  wavHeader.write("data", 36)
  // Subchunk2Size: number of bytes in the data
  wavHeader.writeUInt32LE(dataLength, 40)

  return Buffer.concat([wavHeader, pcmBuffer])
}
