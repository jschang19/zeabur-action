import fs from 'fs'
import archiver from 'archiver'
import * as core from '@actions/core'

export async function zipRepo(outputPath: string) {
  return new Promise<void | Error>((resolve, reject) => {
    const output = fs.createWriteStream(outputPath)
    const archive = archiver('zip', {
      zlib: {
        level: 9
      }
    })

    output.on('close', () => {
      core.info(
        `✅ Repo zipped successfully: ${outputPath} (${archive.pointer()} bytes)`
      )
      resolve()
    })

    archive.on('error', (err: Error) => {
      core.setFailed(`❌ ZIP error: ${err.message}`)
      reject(err)
    })

    archive.pipe(output)
    archive.directory(process.cwd(), false)
    archive.finalize()
  })
}
