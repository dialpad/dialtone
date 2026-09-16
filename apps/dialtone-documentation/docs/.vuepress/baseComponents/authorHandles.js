export const authorHandles = {
  'Brad Paugh': 'braddialpad',
  'Francis Rupert': 'francisrupert',
  'Tico Ortega': 'juliodialpad',
  'Nina Repetto': 'ninarepetto',
  'Yorbi Barriento': 'yorbi-dp',
  'Julio Ortega': 'juliodialpad',
  'Federico Sarassola': 'fede-dp',
  'Josh Everhart': 'jeverhart-dialpad',
  'Joshua Hynes': 'hynes-dialpad',
  'Belu Montoya': 'belumontoya',
  'Ignacio Ropolo': 'iropolo',
  'Paulo Reis': 'paulojreis-dialpad',
};

// Returns the GitHub avatar URL for an author, or '' if unmapped.
// '' means DtAvatar renders seeded initials (the unmapped fallback).
export function authorAvatarUrl (author) {
  const handle = authorHandles[author];
  return handle ? `https://github.com/${handle}.png` : '';
}
