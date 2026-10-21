import { rgbToHex } from './color.js';
import { ApiGetLocalVariablesResponse, Color, Variable, VariableAlias, VariableValue } from './figma_api.js';
import { Token, TokensFile } from './token_types.js';

function tokenTypeFromVariable (variable: Variable) {
  switch (variable.resolvedType) {
    case 'BOOLEAN':
      return 'boolean';
    case 'COLOR':
      return 'color';
    case 'FLOAT':
      return 'number';
    case 'STRING':
      return 'string';
  }
}

function getCustomType (variable: Variable) {
  const variableNames = variable.name.split('/');

  const customTypeMap = {
    space: { space: 'spacing' },
    size: {
      border: 'borderWidth',
      radius: 'borderRadius',
      size: 'sizing',
    },
  };

  if (!customTypeMap[variableNames[0]]) return undefined;

  return customTypeMap[variableNames[0]][variableNames[1]] || customTypeMap[variableNames[0]][variableNames[0]];
}

// Real generated data chains more than one hop — `color/surface/primary-opaque`
// aliases `color/surface/secondary`, itself an alias to `color/black/100` — so
// resolving only the immediate target isn't enough. 10 hops is far more than
// any real alias chain in this codebase ever needs; past it this is almost
// certainly a cycle, and failing loudly beats recursing forever.
const MAX_ALIAS_HOPS = 10;

/** Resolves a colour channel that may itself be an alias, to a literal — following the full chain, not just one hop. */
function resolveColorChannel (
  value: Color | VariableAlias,
  localVariables: { [id: string]: Variable },
  modeId: string,
): Color {
  let current: VariableValue = value;
  let name = '(composedColor)';
  for (let hop = 0; hop < MAX_ALIAS_HOPS; hop++) {
    if (typeof current !== 'object') {
      throw new Error(`composedColor's colour alias did not resolve to a colour: ${name}`);
    }
    if ('r' in current) return current;
    if (!('type' in current) || current.type !== 'VARIABLE_ALIAS') {
      throw new Error(`composedColor's colour alias did not resolve to a colour: ${name}`);
    }
    const aliased = localVariables[current.id];
    name = aliased.name;
    current = aliased.valuesByMode[modeId];
  }
  throw new Error(`composedColor's colour alias chain is more than ${MAX_ALIAS_HOPS} hops deep — likely a cycle: ${name}`);
}

function tokenValueFromVariable (
  variable: Variable,
  modeId: string,
  localVariables: { [id: string]: Variable },
) {
  const value = variable.valuesByMode[modeId];
  if (typeof value === 'object') {
    if ('type' in value && value.type === 'VARIABLE_ALIAS') {
      const aliasedVariable = localVariables[value.id];
      return `{${aliasedVariable.name.replace(/\//g, '.')}}`;
    } else if ('r' in value) {
      return rgbToHex(value);
    } else if ('color' in value && 'opacity' in value) {
      // A VariableComposedColor — build_variables.ts's write side for a
      // Tokens Studio `alpha` modifier (see token_types.ts's `composedColor`
      // doc). There's no alias-plus-modify form to round-trip here that this
      // export format already has a place for, so this flattens it to the
      // literal it currently paints as, same as any other colour this
      // exporter hands back — a value a consumer with no Figma-specific
      // knowledge can still use, which is this whole format's point.
      const color = resolveColorChannel(value.color, localVariables, modeId);
      // The write side only ever composes a literal opacity (see
      // build_variables.ts's own `composedColor`), never an aliased one — an
      // aliased opacity has no literal to flatten to, so there's nothing
      // sensible to export.
      if (typeof value.opacity !== 'number') {
        throw new Error('composedColor with an aliased opacity cannot be flattened to a literal');
      }
      return rgbToHex({ ...color, a: value.opacity / 100 });
    }

    throw new Error(`Format of variable value is invalid: ${value}`);
  } else {
    return value;
  }
}

export function tokenFilesFromLocalVariables (localVariablesResponse: ApiGetLocalVariablesResponse) {
  const tokenFiles: { [fileName: string]: TokensFile } = {};
  const localVariableCollections = localVariablesResponse.meta.variableCollections;
  const localVariables = localVariablesResponse.meta.variables;

  Object.values(localVariables).forEach((variable) => {
    // Skip remote variables because we only want to generate tokens for local variables
    if (variable.remote) {
      return;
    }

    // A deleted-but-referenced ghost shares the live variable's name; Figma
    // keeps returning it while something still points at it. Exporting it
    // would silently overwrite the live variable's token with a stale value
    // if the ghost is iterated after it.
    if (variable.deletedButReferenced) {
      return;
    }

    const collection = localVariableCollections[variable.variableCollectionId];

    collection.modes.forEach((mode) => {
      const fileName = `${collection.name}.${mode.name}.json`;

      if (!tokenFiles[fileName]) {
        tokenFiles[fileName] = {};
      }

      let obj: any = tokenFiles[fileName];

      variable.name.split('/').forEach((groupName) => {
        obj[groupName] = obj[groupName] || {};
        obj = obj[groupName];
      });

      const token: Token = {
        $type: tokenTypeFromVariable(variable),
        $value: tokenValueFromVariable(variable, mode.modeId, localVariables),
        $description: variable.description,
        $extensions: {
          'com.figma': {
            hiddenFromPublishing: variable.hiddenFromPublishing,
            scopes: variable.scopes,
            codeSyntax: variable.codeSyntax,
          },
        },
        $customType: getCustomType(variable),
      };

      Object.assign(obj, token);
    });
  });

  return tokenFiles;
}
