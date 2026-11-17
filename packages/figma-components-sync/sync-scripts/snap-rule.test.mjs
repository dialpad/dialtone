import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FAMILY_OF, snapNumber, snapPayload, SNAP_TOKEN_NAMES } from './token-snap.mjs';

// generic-builder.js is a plugin function body: it cannot import token-snap.mjs, so it snaps with its
// own nearest-token loop over the scales it is handed. Lift that function out of the source and hold it
// to the same answers as `snapNumber`, which the verifier uses, so the two cannot drift.
const source = readFileSync(new URL('./generic-builder.js', import.meta.url), 'utf8');
const lifted = /const snapSpec = [\s\S]*?\n {2}};\n/.exec(source);

test('the builder holds no copy of the field-to-scale map', () => {
  assert.ok(lifted, 'snapSpec not found in generic-builder.js');
  assert.doesNotMatch(source, /SNAP_FAMILY/);
  assert.deepEqual(snapPayload().fields, FAMILY_OF);
});

test('the builder snaps every field to the same token as snapNumber, ties included', () => {
  const D = { snap: snapPayload(), toks: SNAP_TOKEN_NAMES };
  const snapSpec = new Function('D', `${lifted[0]}\nreturn snapSpec;`)(D);
  let checked = 0;
  for (const [field, family] of Object.entries(FAMILY_OF)) {
    for (let v = 0.25; v <= 80; v += 0.25) {
      const want = snapNumber(family, v);
      const got = snapSpec(field, [v, -1]);
      assert.equal(got[0], want.value, `${field} ${v}`);
      assert.equal(D.toks[got[1]], want.name, `${field} ${v}`);
      checked++;
    }
  }
  assert.ok(checked > 3000);
});

test('a field a config lists in noSnap has no scale, so the builder leaves it exact', () => {
  const payload = snapPayload(['minHeight']);
  assert.equal(payload.fields.minHeight, undefined);
  assert.equal(payload.fields.minWidth, 'layout');
  const D = { snap: payload, toks: SNAP_TOKEN_NAMES };
  const snapSpec = new Function('D', `${lifted[0]}\nreturn snapSpec;`)(D);
  assert.deepEqual(snapSpec('minHeight', [40, -1]), [40, -1]);
  assert.notDeepEqual(snapSpec('minWidth', [40, -1]), [40, -1]);
});

test('a value that is already a token, or zero, is left alone', () => {
  const D = { snap: snapPayload(), toks: SNAP_TOKEN_NAMES };
  const snapSpec = new Function('D', `${lifted[0]}\nreturn snapSpec;`)(D);
  assert.deepEqual(snapSpec('paddingLeft', [7, 3]), [7, 3]);
  assert.deepEqual(snapSpec('paddingLeft', [0, -1]), [0, -1]);
});
