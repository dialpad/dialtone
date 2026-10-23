import { collectionTargets } from './utils.js'

describe('collectionTargets', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns the restricted collection and an unrestricted sibling, each with its own file', () => {
    vi.stubEnv('FILE_KEY', 'restricted-file')
    vi.stubEnv('UNRESTRICTED_FILE_KEY', 'unrestricted-file')

    expect(collectionTargets('Dialtone 2026', [])).toEqual([
      { name: 'Dialtone 2026', publishAll: false, fileKey: 'restricted-file' },
      { name: 'Dialtone 2026 Unrestricted', publishAll: true, fileKey: 'unrestricted-file' },
    ])
  })

  it('derives the sibling from a custom base name, as the preview file uses', () => {
    vi.stubEnv('UNRESTRICTED_FILE_KEY', 'unrestricted-file')

    expect(collectionTargets('Preview', []).map(t => t.name)).toEqual(['Preview', 'Preview Unrestricted'])
  })

  it('lets the file-key flags override the environment', () => {
    vi.stubEnv('FILE_KEY', 'from-env')
    vi.stubEnv('UNRESTRICTED_FILE_KEY', 'from-env-too')

    const targets = collectionTargets('X', ['--file-key', 'a', '--unrestricted-file-key', 'b'])

    expect(targets.map(t => t.fileKey)).toEqual(['a', 'b'])
  })

  it('skips the unrestricted collection when it has no file configured', () => {
    vi.stubEnv('FILE_KEY', 'restricted-file')
    vi.stubEnv('UNRESTRICTED_FILE_KEY', '')

    expect(collectionTargets('X', []).map(t => t.name)).toEqual(['X'])
  })
})
