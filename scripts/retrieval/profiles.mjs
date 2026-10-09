// C5 v1: exact consumer declarations, not an installed-version resolver.
const umbrella = (id, version, icons, integrity) => ({
  id,
  framework: { name: 'vue', version: '3.5.18' },
  dependencies: {
    '@dialpad/dialtone': version,
    '@dialpad/dialtone-icons': icons,
    vue: '3.5.18',
  },
  artifacts: { '@dialpad/dialtone': { version, integrity } },
  layout: { dependencyRoot: '.', invocationRoot: '.' },
  data: {
    components: 'dist/vue3/component-documentation.json',
    utilities: 'dist/css/dialtone-docs.json',
    tokens: 'dist/css/tokens-docs.json',
    schema: 'unversioned-component-array',
  },
  boundaries: version.startsWith('9.')
    ? ['umbrella v9; do not assume DtBox/DtText availability']
    : ['umbrella v10; qualify exports and data from the pinned artifact'],
});
const current = umbrella(
  'dt10-current',
  '10.5.1',
  '5.2.0',
  'sha512-SZ+5Muqmf+z94P6H1Yrxco8BlJ88qKpQnLd1rUFd47iHP6AUSdWC/cJ4R5qMDzn0s16rWdplxk0z9g+612NiKg==',
);
export const profiles = [
  current,
  umbrella(
    'dt10-min',
    '10.0.4',
    '5.0.0',
    'sha512-J1fUMg/dA1g01WM1Kj26CEN/6oNvhStR5MshmxGW4qhi0owTXEVeCyrPCRHdqweKEuyQCVR48cCtRbisRNClTQ==',
  ),
  umbrella(
    'dt9-legacy',
    '9.185.0',
    '4.52.0',
    'sha512-lo+wRRkNAGeYbTzIm6YSjrFcnRDE7FJP1AEG/eKa7fiiy90jb967d2J28DidZOZQ2EC//MkinHm7z/m5gRb59A==',
  ),
  {
    id: 'standalone-vue3-legacy',
    framework: { name: 'vue', version: '3.5.18' },
    dependencies: {
      '@dialpad/dialtone-vue': '3.157.0',
      '@dialpad/dialtone-css': '8.45.3',
      '@dialpad/dialtone-icons': '4.28.0',
      vue: '3.5.18',
    },
    artifacts: {
      '@dialpad/dialtone-vue': {
        version: '3.157.0',
        integrity:
          'sha512-0wrVqqEyTT2JWa5fgaerx3tjpLn1t+Ip390ca7wTeBYLGKZqlKmXplN+ynSLxZEnc076JUSyqknluStTTp4+pA==',
      },
    },
    layout: { dependencyRoot: '.', invocationRoot: '.' },
    data: {
      components: 'dist/component-documentation.json',
      utilities: 'lib/dist/dialtone-docs.json',
      tokens: 'lib/dist/tokens-docs.json',
      schema: 'unversioned-component-array',
    },
    boundaries: [
      'standalone package major 3; not umbrella major 3',
      'older APIs and imports require artifact qualification',
    ],
  },
  {
    id: 'no-install',
    framework: null,
    dependencies: {},
    artifacts: {},
    layout: { dependencyRoot: '.', invocationRoot: '.' },
    data: {},
    boundaries: ['no installed API or import claim'],
  },
  {
    id: 'partial-install',
    framework: current.framework,
    dependencies: { '@dialpad/dialtone-icons': '5.2.0', vue: '3.5.18' },
    artifacts: {},
    layout: current.layout,
    data: {},
    boundaries: ['icons only; no component availability claim'],
  },
  {
    ...current,
    id: 'nested-umbrella',
    layout: { dependencyRoot: 'web', invocationRoot: 'web/apps/client' },
    boundaries: [
      'resolve from the named dependency root; invocation directory is nested',
    ],
  },
];
export const contractVersion = 1;
export const verificationLevels = [
  'declaration-only',
  'lookup-data-only',
  'installed',
  'built',
  'browser-tested',
];
export function getProfile(id) {
  const profile = profiles.find((value) => value.id === id);
  if (!profile) throw new Error(`Unknown retrieval profile: ${id}`);
  return structuredClone(profile);
}
