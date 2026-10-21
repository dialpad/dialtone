import { ApiGetLocalVariablesResponse } from './figma_api.js'
import { tokenFilesFromLocalVariables } from './token_export.js'

describe('tokenFilesFromLocalVariables', () => {
  it('ignores remote variables', () => {
    const localVariablesResponse: ApiGetLocalVariablesResponse = {
      status: 200,
      error: false,
      meta: {
        variableCollections: {
          'VariableCollectionId:1:1': {
            id: 'VariableCollectionId:1:1',
            name: 'primitives',
            modes: [{ modeId: '1:0', name: 'mode1' }],
            defaultModeId: '1:0',
            remote: true,
            hiddenFromPublishing: false,
          },
        },
        variables: {
          'VariableID:2:1': {
            id: 'VariableID:2:1',
            name: 'spacing/1',
            key: 'variable_key',
            variableCollectionId: 'VariableCollectionId:1:1',
            resolvedType: 'FLOAT',
            valuesByMode: {
              '1:0': 8,
            },
            remote: true,
            description: '',
            hiddenFromPublishing: false,
            scopes: ['ALL_SCOPES'],
            codeSyntax: {},
          },
        },
      },
    }

    const tokenFiles = tokenFilesFromLocalVariables(localVariablesResponse)
    expect(tokenFiles).toEqual({})
  })

  it('ignores a deleted-but-referenced variable, even one sharing a live variable\'s name', () => {
    const localVariablesResponse: ApiGetLocalVariablesResponse = {
      status: 200,
      error: false,
      meta: {
        variableCollections: {
          'VariableCollectionId:1:1': {
            id: 'VariableCollectionId:1:1',
            name: 'primitives',
            modes: [{ modeId: '1:0', name: 'mode1' }],
            defaultModeId: '1:0',
            remote: false,
            hiddenFromPublishing: false,
          },
        },
        variables: {
          'VariableID:2:1': {
            id: 'VariableID:2:1',
            name: 'spacing/1',
            key: 'variable_key',
            variableCollectionId: 'VariableCollectionId:1:1',
            resolvedType: 'FLOAT',
            valuesByMode: {
              '1:0': 8,
            },
            remote: false,
            description: '',
            hiddenFromPublishing: false,
            scopes: ['ALL_SCOPES'],
            codeSyntax: {},
          },
          // A ghost of a deleted variable, still returned because something
          // references it, sharing the live variable's name and appearing
          // after it in iteration order — the exact shape that would let a
          // reverse export overwrite the live token with its stale value.
          'VariableID:2:2': {
            id: 'VariableID:2:2',
            name: 'spacing/1',
            key: 'variable_key_deleted',
            variableCollectionId: 'VariableCollectionId:1:1',
            resolvedType: 'FLOAT',
            valuesByMode: {
              '1:0': 999,
            },
            remote: false,
            deletedButReferenced: true,
            description: '',
            hiddenFromPublishing: false,
            scopes: ['ALL_SCOPES'],
            codeSyntax: {},
          },
        },
      },
    }

    const tokenFiles = tokenFilesFromLocalVariables(localVariablesResponse)
    expect(tokenFiles['primitives.mode1.json'].spacing['1'].$value).toBe(8)
  })

  it('returns token files', () => {
    const localVariablesResponse: ApiGetLocalVariablesResponse = {
      status: 200,
      error: false,
      meta: {
        variableCollections: {
          'VariableCollectionId:1:1': {
            id: 'VariableCollectionId:1:1',
            name: 'primitives',
            modes: [
              { modeId: '1:0', name: 'mode1' },
              { modeId: '1:1', name: 'mode2' },
            ],
            defaultModeId: '1:0',
            remote: false,
            hiddenFromPublishing: false,
          },
        },
        variables: {
          'VariableID:2:1': {
            id: 'VariableID:2:1',
            name: 'spacing/1',
            key: 'variable_key',
            variableCollectionId: 'VariableCollectionId:1:1',
            resolvedType: 'FLOAT',
            valuesByMode: {
              '1:0': 8,
              '1:1': 8,
            },
            remote: false,
            description: '8px spacing',
            hiddenFromPublishing: true,
            scopes: ['TEXT_CONTENT'],
            codeSyntax: { WEB: 'web', ANDROID: 'android' },
          },
          'VariableID:2:2': {
            id: 'VariableID:2:2',
            name: 'spacing/2',
            key: 'variable_key2',
            variableCollectionId: 'VariableCollectionId:1:1',
            resolvedType: 'FLOAT',
            valuesByMode: {
              '1:0': 16,
              '1:1': 16,
            },
            remote: false,
            description: '16px spacing',
            hiddenFromPublishing: false,
            scopes: ['ALL_SCOPES'],
            codeSyntax: {},
          },
          'VariableID:2:3': {
            id: 'VariableID:2:3',
            name: 'color/brand/radish',
            key: 'variable_key3',
            variableCollectionId: 'VariableCollectionId:1:1',
            resolvedType: 'COLOR',
            valuesByMode: {
              '1:0': { r: 1, g: 0.7450980392156863, b: 0.08627450980392157, a: 1 },
              '1:1': { r: 1, g: 0.796078431372549, b: 0.7176470588235294, a: 1 },
            },
            remote: false,
            description: 'Radish color',
            hiddenFromPublishing: false,
            scopes: ['ALL_SCOPES'],
            codeSyntax: {},
          },
          'VariableID:2:4': {
            id: 'VariableID:2:4',
            name: 'color/brand/pear',
            key: 'variable_key4',
            variableCollectionId: 'VariableCollectionId:1:1',
            resolvedType: 'COLOR',
            valuesByMode: {
              '1:0': { r: 1, g: 0, b: 0.08627450980392157, a: 1 },
              '1:1': { r: 0.8705882352941177, g: 0.9529411764705882, b: 0.34509803921568627, a: 1 },
            },
            remote: false,
            description: 'Pear color',
            hiddenFromPublishing: false,
            scopes: ['ALL_SCOPES'],
            codeSyntax: {},
          },
        },
      },
    }

    const tokenFiles = tokenFilesFromLocalVariables(localVariablesResponse)

    expect(tokenFiles['primitives.mode1.json']).toEqual({
      spacing: {
        '1': {
          $type: 'number',
          $value: 8,
          $description: '8px spacing',
          $extensions: {
            'com.figma': {
              hiddenFromPublishing: true,
              scopes: ['TEXT_CONTENT'],
              codeSyntax: { WEB: 'web', ANDROID: 'android' },
            },
          },
        },
        '2': {
          $type: 'number',
          $value: 16,
          $description: '16px spacing',
          $extensions: {
            'com.figma': {
              hiddenFromPublishing: false,
              scopes: ['ALL_SCOPES'],
              codeSyntax: {},
            },
          },
        },
      },
      color: {
        brand: {
          radish: {
            $type: 'color',
            $value: '#ffbe16',
            $description: 'Radish color',
            $extensions: {
              'com.figma': {
                hiddenFromPublishing: false,
                scopes: ['ALL_SCOPES'],
                codeSyntax: {},
              },
            },
          },
          pear: {
            $type: 'color',
            $value: '#ff0016',
            $description: 'Pear color',
            $extensions: {
              'com.figma': {
                hiddenFromPublishing: false,
                scopes: ['ALL_SCOPES'],
                codeSyntax: {},
              },
            },
          },
        },
      },
    })

    expect(tokenFiles['primitives.mode2.json']).toEqual({
      spacing: {
        '1': {
          $type: 'number',
          $value: 8,
          $description: '8px spacing',
          $extensions: {
            'com.figma': {
              hiddenFromPublishing: true,
              scopes: ['TEXT_CONTENT'],
              codeSyntax: { WEB: 'web', ANDROID: 'android' },
            },
          },
        },
        '2': {
          $type: 'number',
          $value: 16,
          $description: '16px spacing',
          $extensions: {
            'com.figma': {
              hiddenFromPublishing: false,
              scopes: ['ALL_SCOPES'],
              codeSyntax: {},
            },
          },
        },
      },
      color: {
        brand: {
          radish: {
            $type: 'color',
            $value: '#ffcbb7',
            $description: 'Radish color',
            $extensions: {
              'com.figma': {
                hiddenFromPublishing: false,
                scopes: ['ALL_SCOPES'],
                codeSyntax: {},
              },
            },
          },
          pear: {
            $type: 'color',
            $value: '#def358',
            $description: 'Pear color',
            $extensions: {
              'com.figma': {
                hiddenFromPublishing: false,
                scopes: ['ALL_SCOPES'],
                codeSyntax: {},
              },
            },
          },
        },
      },
    })
  })

  it('flattens a VariableComposedColor to the literal it currently paints as', () => {
    const localVariablesResponse: ApiGetLocalVariablesResponse = {
      status: 200,
      error: false,
      meta: {
        variableCollections: {
          'VariableCollectionId:1:1': {
            id: 'VariableCollectionId:1:1',
            name: 'primitives',
            modes: [
              { modeId: '1:0', name: 'mode1' },
              { modeId: '1:1', name: 'mode2' },
            ],
            defaultModeId: '1:0',
            remote: false,
            hiddenFromPublishing: false,
          },
        },
        variables: {
          // Deliberately different per mode, so resolving the alias against
          // the wrong mode (e.g. grabbing valuesByMode's first entry instead
          // of indexing by the composed color's own modeId) produces a
          // different, wrong colour instead of coincidentally matching.
          'VariableID:2:1': {
            id: 'VariableID:2:1',
            name: 'color/black/900',
            key: 'variable_key1',
            variableCollectionId: 'VariableCollectionId:1:1',
            resolvedType: 'COLOR',
            valuesByMode: {
              '1:0': { r: 0.1, g: 0.2, b: 0.3, a: 1 },
              '1:1': { r: 0.9, g: 0.8, b: 0.7, a: 1 },
            },
            remote: false,
            description: '',
            hiddenFromPublishing: false,
            scopes: ['ALL_SCOPES'],
            codeSyntax: {},
          },
          // An alpha-modified alias to color/black/900 — build_variables.ts's
          // write side for a Tokens Studio `alpha` modifier.
          'VariableID:2:2': {
            id: 'VariableID:2:2',
            name: 'color/surface/primary-opaque',
            key: 'variable_key2',
            variableCollectionId: 'VariableCollectionId:1:1',
            resolvedType: 'COLOR',
            valuesByMode: {
              '1:0': {
                color: { type: 'VARIABLE_ALIAS', id: 'VariableID:2:1' },
                opacity: 50,
              },
              '1:1': {
                color: { type: 'VARIABLE_ALIAS', id: 'VariableID:2:1' },
                opacity: 50,
              },
            },
            remote: false,
            description: '',
            hiddenFromPublishing: false,
            scopes: ['ALL_SCOPES'],
            codeSyntax: {},
          },
        },
      },
    }

    const tokenFiles = tokenFilesFromLocalVariables(localVariablesResponse)

    expect(tokenFiles['primitives.mode1.json'].color.surface['primary-opaque'].$value)
      .toBe('#1a334d80')
    expect(tokenFiles['primitives.mode2.json'].color.surface['primary-opaque'].$value)
      .toBe('#e6ccb380')
  })

  it('follows a composed colour\'s alias through more than one hop', () => {
    // Real generated data does this: color/surface/primary-opaque ->
    // color/surface/secondary -> color/black/100 — a two-hop chain, not the
    // one hop a composed colour's immediate alias target usually is.
    const localVariablesResponse: ApiGetLocalVariablesResponse = {
      status: 200,
      error: false,
      meta: {
        variableCollections: {
          'VariableCollectionId:1:1': {
            id: 'VariableCollectionId:1:1',
            name: 'primitives',
            modes: [{ modeId: '1:0', name: 'mode1' }],
            defaultModeId: '1:0',
            remote: false,
            hiddenFromPublishing: false,
          },
        },
        variables: {
          'VariableID:2:1': {
            id: 'VariableID:2:1',
            name: 'color/black/100',
            key: 'variable_key1',
            variableCollectionId: 'VariableCollectionId:1:1',
            resolvedType: 'COLOR',
            valuesByMode: {
              '1:0': { r: 0.1, g: 0.2, b: 0.3, a: 1 },
            },
            remote: false,
            description: '',
            hiddenFromPublishing: false,
            scopes: ['ALL_SCOPES'],
            codeSyntax: {},
          },
          'VariableID:2:2': {
            id: 'VariableID:2:2',
            name: 'color/surface/secondary',
            key: 'variable_key2',
            variableCollectionId: 'VariableCollectionId:1:1',
            resolvedType: 'COLOR',
            valuesByMode: {
              '1:0': { type: 'VARIABLE_ALIAS', id: 'VariableID:2:1' },
            },
            remote: false,
            description: '',
            hiddenFromPublishing: false,
            scopes: ['ALL_SCOPES'],
            codeSyntax: {},
          },
          'VariableID:2:3': {
            id: 'VariableID:2:3',
            name: 'color/surface/primary-opaque',
            key: 'variable_key3',
            variableCollectionId: 'VariableCollectionId:1:1',
            resolvedType: 'COLOR',
            valuesByMode: {
              '1:0': {
                color: { type: 'VARIABLE_ALIAS', id: 'VariableID:2:2' },
                opacity: 50,
              },
            },
            remote: false,
            description: '',
            hiddenFromPublishing: false,
            scopes: ['ALL_SCOPES'],
            codeSyntax: {},
          },
        },
      },
    }

    const tokenFiles = tokenFilesFromLocalVariables(localVariablesResponse)

    expect(tokenFiles['primitives.mode1.json'].color.surface['primary-opaque'].$value)
      .toBe('#1a334d80')
  })

  it('handles aliases', () => {
    const localVariablesResponse: ApiGetLocalVariablesResponse = {
      status: 200,
      error: false,
      meta: {
        variableCollections: {
          'VariableCollectionId:1:1': {
            id: 'VariableCollectionId:1:1',
            name: 'collection1',
            modes: [
              { modeId: '1:0', name: 'mode1' },
              { modeId: '1:1', name: 'mode2' },
            ],
            defaultModeId: '1:0',
            remote: false,
            hiddenFromPublishing: false,
          },
        },
        variables: {
          'VariableID:2:1': {
            id: 'VariableID:2:1',
            name: 'var1',
            key: 'variable_key1',
            variableCollectionId: 'VariableCollectionId:1:1',
            resolvedType: 'FLOAT',
            valuesByMode: {
              '1:0': 1,
            },
            remote: false,
            description: 'var1 description',
            hiddenFromPublishing: false,
            scopes: ['ALL_SCOPES'],
            codeSyntax: {},
          },
          'VariableID:2:2': {
            id: 'VariableID:2:2',
            name: 'var2',
            key: 'variable_key2',
            variableCollectionId: 'VariableCollectionId:1:1',
            resolvedType: 'FLOAT',
            valuesByMode: {
              '1:0': { type: 'VARIABLE_ALIAS', id: 'VariableID:2:1' },
            },
            remote: false,
            description: 'var2 description',
            hiddenFromPublishing: false,
            scopes: ['ALL_SCOPES'],
            codeSyntax: {},
          },
        },
      },
    }

    const tokenFiles = tokenFilesFromLocalVariables(localVariablesResponse)

    expect(tokenFiles['collection1.mode1.json']).toEqual({
      var1: {
        $type: 'number',
        $value: 1,
        $description: 'var1 description',
        $extensions: {
          'com.figma': {
            hiddenFromPublishing: false,
            scopes: ['ALL_SCOPES'],
            codeSyntax: {},
          },
        },
      },
      var2: {
        $type: 'number',
        $value: '{var1}',
        $description: 'var2 description',
        $extensions: {
          'com.figma': {
            hiddenFromPublishing: false,
            scopes: ['ALL_SCOPES'],
            codeSyntax: {},
          },
        },
      },
    })
  })
})
