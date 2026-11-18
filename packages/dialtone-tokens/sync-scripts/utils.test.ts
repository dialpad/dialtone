import { collectionTarget } from './utils.js'

describe('collectionTarget', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns the collection with the file from the environment', () => {
    vi.stubEnv('FILE_KEY', 'main-file')

    expect(collectionTarget('Dialtone 2026', [])).toEqual({ name: 'Dialtone 2026', fileKey: 'main-file' })
  })

  it('takes the collection name from a custom base, as the preview file uses', () => {
    vi.stubEnv('FILE_KEY', 'preview-file')

    expect(collectionTarget('Dialtone 2026 Preview', []).name).toBe('Dialtone 2026 Preview')
  })

  it('lets --file-key override the environment', () => {
    vi.stubEnv('FILE_KEY', 'from-env')

    expect(collectionTarget('X', ['--file-key', 'scratch']).fileKey).toBe('scratch')
  })

  it('has no file when neither the flag nor the environment gives one', () => {
    vi.stubEnv('FILE_KEY', '')

    expect(collectionTarget('X', []).fileKey).toBeUndefined()
  })
})
