import * as core from '@actions/core'
import { zipRepo } from './zip.js'
import { upload } from './upload.js'
import path from 'path'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const projectId: string = core.getInput('project_id')
    const serviceId: string = core.getInput('service_id')
    const environmentId: string = core.getInput('environment_id')
    const zeaburApiKey: string = core.getInput('zeabur_api_key') // This should be a secret

    const zipFileName = 'repo.zip'
    const zipFilePath = path.join(process.cwd(), zipFileName)

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(
      `Deploying service ${serviceId} to environment ${environmentId} in project ${projectId}`
    )

    // Zip the repo
    try {
      core.info(`Zipping repo`)
      await zipRepo(zipFilePath)
    } catch (error) {
      if (error instanceof Error) core.setFailed(error.message)
    }

    try {
      core.info(`Uploading ${zipFilePath} to Zeabur`)
      const result = await upload({
        projectId,
        serviceId,
        environmentId,
        zeaburApiKey,
        codeZip: zipFilePath
      })

      if (result.url) {
        // set success and show the build url
        core.setOutput('build_url', result.url)
        return
      } else {
        core.setFailed('Failed to upload code')
        if (result.error) {
          core.error(`Error: ${result.error}`)
        }
        if (result.errors) {
          for (const err of result.errors) {
            core.error(`Error code: ${err.extensions.code}`)
          }
        }
        if (result.message) {
          core.error(`Message: ${result.message}`)
        }
      }
    } catch (error) {
      if (error instanceof Error) core.setFailed(error.message)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
