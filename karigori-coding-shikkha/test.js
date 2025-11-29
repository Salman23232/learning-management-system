import { spawn } from 'child_process'
import { unlink, stat } from 'fs/promises'

async function speakBangla(text, outputWav) {
  try {
    await unlink(outputWav)
  } catch {} // ignore

  return new Promise((resolve, reject) => {
    const espeakPath = 'C:\\Program Files\\eSpeak NG\\espeak-ng.exe' // <-- full path
    const args = ['-v', 'bn', '-w', outputWav, text]
    const espeak = spawn(espeakPath, args)

    espeak.stderr.on('data', (d) => console.error(`stderr: ${d}`))
    espeak.on('error', (err) => reject(err))
    espeak.on('close', (code) => {
      code === 0 ? resolve() : reject(new Error(`espeak-ng exited with code ${code}`))
    })
  })
}

;(async () => {
  const text = 'আমি বাংলায় কথা বলি।'
  const output = 'bangla.wav'
  try {
    await speakBangla(text, output)
    const info = await stat(output)
    console.log('Written to', output, `(${info.size} bytes)`)
  } catch (err) {
    console.error('Error:', err)
  }
})()
