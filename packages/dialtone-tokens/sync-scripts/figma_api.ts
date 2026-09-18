import axios from 'axios'

export interface VariableMode {
  modeId: string
  name: string
}

export interface VariableModeChange {
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  id?: string
  name?: string
  variableCollectionId: string
}

export interface VariableCollection {
  id: string
  name: string
  modes: VariableMode[]
  defaultModeId: string
  remote: boolean
  hiddenFromPublishing: boolean
}

export interface VariableCollectionChange
  extends Partial<Pick<VariableCollection, 'id' | 'name' | 'hiddenFromPublishing'>> {
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  initialModeId?: string
}

export interface Color {
  r: number
  g: number
  b: number
  a?: number
}

export interface VariableAlias {
  type: 'VARIABLE_ALIAS'
  id: string
}

/**
 * A colour whose colour and opacity channels are authored independently — at
 * least one of the two must be an alias, or it isn't composed. `opacity` is a
 * PERCENTAGE (0-100 per the REST API's own field definition), not a 0-1
 * fraction like `Color.a`.
 */
export interface VariableComposedColor {
  color: Color | VariableAlias
  opacity: number | VariableAlias
}

export type VariableValue = boolean | number | string | Color | VariableAlias | VariableComposedColor

export type VariableScope = 'ALL_SCOPES' | VariableFloatScopes | VariableColorScopes
type VariableFloatScopes = 'TEXT_CONTENT' | 'WIDTH_HEIGHT' | 'GAP'
type VariableColorScopes = 'ALL_FILLS' | 'FRAME_FILL' | 'SHAPE_FILL' | 'TEXT_FILL' | 'STROKE_COLOR'

export type VariableCodeSyntax = { WEB?: string; ANDROID?: string; iOS?: string }

export interface Variable {
  id: string
  name: string
  key: string
  variableCollectionId: string
  resolvedType: 'BOOLEAN' | 'FLOAT' | 'STRING' | 'COLOR'
  valuesByMode: { [modeId: string]: VariableValue }
  remote: boolean
  description: string
  hiddenFromPublishing: boolean
  scopes: VariableScope[]
  codeSyntax: VariableCodeSyntax
}

export interface VariableChange
  extends Partial<
    Pick<
      Variable,
      | 'id'
      | 'name'
      | 'variableCollectionId'
      | 'resolvedType'
      | 'description'
      | 'hiddenFromPublishing'
      | 'scopes'
      | 'codeSyntax'
    >
  > {
  action: 'CREATE' | 'UPDATE' | 'DELETE'
}

export interface VariableModeValue {
  variableId: string
  modeId: string
  value: VariableValue
}

export interface ApiGetLocalVariablesResponse {
  status: number
  error: boolean
  meta: {
    variableCollections: { [id: string]: VariableCollection }
    variables: { [id: string]: Variable }
  }
}

export interface ApiPostVariablesPayload {
  variableCollections?: VariableCollectionChange[]
  variableModes?: VariableModeChange[]
  variables?: VariableChange[]
  variableModeValues?: VariableModeValue[]
}

interface ApiPostVariablesResponse {
  status: number
  error: boolean
  meta: { tempIdToRealId: { [tempId: string]: string } }
}

const TIMEOUT_MS = 30_000
const MAX_ATTEMPTS = 3

function isTransient(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false
  // No response at all (timeout, DNS, connection reset) is exactly the kind
  // of thing a retry can paper over. A 429 or 5xx is Figma's side failing
  // transiently; a 4xx otherwise is a real client error retrying won't fix.
  const status = error.response?.status
  return status === undefined || status === 429 || status >= 500
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default class FigmaApi {
  private baseUrl = 'https://api.figma.com'
  private token: string

  constructor(token: string) {
    this.token = token
  }

  /**
   * A run with no timeout can hang a CI job indefinitely on a stalled
   * socket — that applies to every call, so the timeout is unconditional.
   * Retrying is a different question: Figma's Variables POST accepts CREATE
   * actions with no documented idempotency guarantee. If the first write
   * actually committed server-side and only the RESPONSE was lost (a true
   * no-response timeout, not a clean error), replaying the same payload can
   * create duplicate variables or collections — a GET has no such risk, it
   * changes nothing either way. So `retry` defaults true for reads and is
   * turned off explicitly for the one write call.
   */
  private async request<T>(
    config: Parameters<typeof axios.request>[0],
    retry = true,
  ): Promise<T> {
    let lastError: unknown
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const resp = await axios.request<T>({ timeout: TIMEOUT_MS, ...config })
        return resp.data
      } catch (error) {
        lastError = error
        if (!retry || attempt === MAX_ATTEMPTS || !isTransient(error)) throw error
        await sleep(2 ** attempt * 500) // 1s, 2s
      }
    }
    throw lastError
  }

  async getLocalVariables(fileKey: string) {
    return this.request<ApiGetLocalVariablesResponse>({
      url: `${this.baseUrl}/v1/files/${fileKey}/variables/local`,
      headers: {
        Accept: '*/*',
        'X-Figma-Token': this.token,
      },
    })
  }

  async postVariables(fileKey: string, payload: ApiPostVariablesPayload) {
    return this.request<ApiPostVariablesResponse>(
      {
        url: `${this.baseUrl}/v1/files/${fileKey}/variables`,
        method: 'POST',
        headers: {
          Accept: '*/*',
          'X-Figma-Token': this.token,
        },
        data: payload,
      },
      false, // never retry — see the comment on request() above
    )
  }
}
