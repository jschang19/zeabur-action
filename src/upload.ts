import { fetch } from 'undici'

interface UploadParams {
  projectId: string
  serviceId: string
  environmentId: string
  zeaburApiKey: string
  codeZip: string
}

interface DeployRequestBody {
  code: string // base64 encoded zip file
  environment: string
}

interface DeployResponse {
  // Add specific response fields based on API documentation
  url?: string
  error?: string
  errors?: {
    extensions: {
      code: string
    }
  }[]
  message?: string
}

export async function upload({
  projectId,
  serviceId,
  environmentId,
  zeaburApiKey,
  codeZip
}: UploadParams): Promise<DeployResponse> {
  const url = `https://api.zeabur.com/projects/${projectId}/services/${serviceId}/deploy`

  const body: DeployRequestBody = {
    code: codeZip,
    environment: environmentId
  }

  return fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${zeaburApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}
