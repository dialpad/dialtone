import axios from 'axios'
import { readFileSync } from 'fs'

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

/**
 * Loads a `--local-snapshot` file — a recovery valve for when the REST read
 * this normally comes from (`FigmaApi.getLocalVariables`) is stuck serving
 * stale or wrong data, letting an operator substitute ground truth captured
 * through the Plugin API instead. Shared by build_variables.ts and
 * build_materials.ts, which otherwise each inlined this parse-and-trust step
 * with no validation at all — an incomplete snapshot (missing a variable or
 * collection that genuinely exists) would make the generator believe it needs
 * to CREATE something that already exists, and Figma does not reject a
 * duplicate name, so that failure is silent rather than loud.
 *
 * This only catches gross malformation (not a parseable snapshot shape, or
 * one with no collections/variables at all) — it cannot detect a snapshot
 * that is merely incomplete or stale relative to the live file, since from
 * the shape alone there is no way to tell "this variable doesn't exist" from
 * "this variable was never captured." Completeness is the operator's
 * responsibility when building the snapshot; this just stops a glaringly
 * broken file from silently reaching a live POST.
 */
export function loadLocalSnapshot(path: string): ApiGetLocalVariablesResponse {
  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(path, 'utf8'))
  } catch (error) {
    throw new Error(`--local-snapshot ${path}: not valid JSON (${(error as Error).message})`)
  }

  const meta = (parsed as { meta?: unknown })?.meta
  const collections = (meta as { variableCollections?: unknown })?.variableCollections
  const variables = (meta as { variables?: unknown })?.variables
  const isPlainObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null && !Array.isArray(v)

  if (!isPlainObject(meta) || !isPlainObject(collections) || !isPlainObject(variables)) {
    throw new Error(
      `--local-snapshot ${path}: missing or malformed meta.variableCollections/meta.variables — ` +
      'expected the ApiGetLocalVariablesResponse shape',
    )
  }
  if (Object.keys(collections).length === 0 || Object.keys(variables).length === 0) {
    throw new Error(
      `--local-snapshot ${path}: meta.variableCollections or meta.variables is empty — ` +
      'a snapshot with nothing in it is never correct, even right after a full delete ' +
      '(the collection itself still exists)',
    )
  }

  return parsed as ApiGetLocalVariablesResponse
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
