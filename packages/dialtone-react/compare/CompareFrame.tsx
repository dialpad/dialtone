// Vue and React side by side: one story id, the same URL args and the same
// theme and contrast globals in both frames. Dark mode isn't a global in
// either Storybook (it's the dark-mode addon's event), so it's posted into
// each frame once it renders. With the compareSync global on, the pointer and
// page scroll in one frame are mirrored in the other (sync.ts).
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { RefObject } from 'react';
import { addons } from 'storybook/preview-api';
import { DARK_MODE_EVENT_NAME } from '@vueless/storybook-dark-mode';
import { ArgControls } from './ArgControls';
import type { ArgType } from './ArgControls';
import {
  fetchStories,
  frameOrigin,
  iframeUrl,
  isPublished,
  overridesParam,
  parseChannelMessage,
  postChannelEvent,
  storybookUrl,
  where,
} from './frames';
import type { Args, IndexedStory, Side } from './frames';
import { IDLE_STATUS, boxOf, createSyncRelay, frameOffset, syncChip } from './sync';
import type { ReactStatus, RelayStatus, SyncChip, SyncRelay } from './sync';
import { SyncCursor } from './SyncCursor';
import { readStoredDarkMode } from '../.storybook/shared';

interface Prepared {
  args: Args;
  initialArgs: Args;
  argTypes: Record<string, ArgType>;
  parameters?: { controls?: { disable?: boolean } };
}

interface CompareFrameProps {
  storyId: string;
  title: string;
  /** The Vue story's CSF file, as Vue's index gives it. */
  vueImportPath: string;
  globals: Args;
}

export function CompareFrame (props: CompareFrameProps) {
  // A fresh host per story: args changed on one story don't carry to the next.
  return <CompareHost key={props.storyId} {...props} />;
}

function useDarkMode () {
  const [isDark, setIsDark] = useState(readStoredDarkMode);
  useEffect(() => {
    const channel = addons.getChannel();
    channel.on(DARK_MODE_EVENT_NAME, setIsDark);
    return () => channel.off(DARK_MODE_EVENT_NAME, setIsDark);
  }, []);
  return isDark;
}

function CompareHost ({ storyId, title, vueImportPath, globals }: CompareFrameProps) {
  const [overrides, setOverrides] = useState<Args>({});
  const [vue, setVue] = useState<Prepared | null>(null);
  // The args each frame actually applied on its latest load, to spot URL args
  // a story drops (see notApplied below).
  const [applied, setApplied] = useState<Partial<Record<Side, Args>>>({});
  const [reactStatus, setReactStatus] = useState<ReactStatus>('checking');
  // React stories that look like this one under another id (see NotPorted).
  const [lookalikes, setLookalikes] = useState<string[]>([]);
  const isDark = useDarkMode();
  const vueFrame = useRef<HTMLIFrameElement>(null);
  const reactFrame = useRef<HTMLIFrameElement>(null);
  // The boxes around the frames, which the phantom cursor is drawn in.
  const vueViewport = useRef<HTMLDivElement>(null);
  const reactViewport = useRef<HTMLDivElement>(null);
  // The message listener is registered once, so it reads the mode through a
  // ref; the dark-mode effect below keeps it current.
  const isDarkRef = useRef(isDark);
  const syncOn = globals.compareSync === 'on';
  const [relayStatus, setRelayStatus] = useState<RelayStatus>(IDLE_STATUS);
  const [relay] = useState(() => createSyncRelay({
    post: (side, message) => {
      const frame = side === 'vue' ? vueFrame.current : reactFrame.current;
      frame?.contentWindow?.postMessage(message, frameOrigin(side));
    },
    onStatus: setRelayStatus,
  }));

  // React's Storybook can come up after this page, or restart, and a port adds
  // its story while this page is open: until the index answers with this story,
  // check again every 2s, so the pane picks it up without a reload.
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const check = () => {
      void fetchStories('react').then((stories) => {
        if (cancelled) return;
        if (stories?.has(storyId)) {
          setReactStatus('ported');
          return;
        }
        setReactStatus(stories ? 'missing' : 'unreachable');
        if (stories) {
          const found = findLookalikes(stories, { id: storyId, title, importPath: vueImportPath });
          // The same list keeps the same array, so an unchanged poll doesn't re-render.
          setLookalikes(prev => (prev.join('\n') === found.join('\n') ? prev : found));
        }
        timer = setTimeout(check, 2000);
      });
    };
    check();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [storyId, title, vueImportPath]);

  // Sync needs the story on both sides. Off, or without React's story, the
  // frames get nothing: their agents stay inert.
  const canSync = syncOn && reactStatus === 'ported';
  useEffect(() => {
    if (!canSync) return;
    relay.start();
    // Until both answer, say hello again every second (a frame can load
    // after this runs), and mark one that takes too long.
    const timer = setInterval(relay.tick, 1000);
    return () => {
      clearInterval(timer);
      relay.stop();
    };
  }, [canSync, relay]);

  useEffect(() => {
    const sideOf = (source: MessageEventSource | null): Side | null =>
      source === vueFrame.current?.contentWindow ? 'vue'
        : source === reactFrame.current?.contentWindow ? 'react'
          : null;

    const onMessage = (message: MessageEvent) => {
      const side = sideOf(message.source);
      // The sync agent's messages are objects with their own key, which
      // parseChannelMessage ignores anyway; the relay takes them first.
      if (!side || relay.receive(side, message.data)) return;
      const event = parseChannelMessage(message.data);
      if (!event) return;
      if (event.type === 'storyPrepared') {
        const prepared = event.args[0] as Prepared;
        // initialArgs and argTypes don't depend on URL args, so Vue's first
        // report stands; later reloads would only repeat it.
        if (side === 'vue') setVue(current => current ?? prepared);
        setApplied(current => ({ ...current, [side]: prepared.args }));
      }
      if (event.type === 'storyRendered') {
        postChannelEvent(message.source as Window, DARK_MODE_EVENT_NAME, [isDarkRef.current]);
        // The preview, and so its agent, is up: the surest time for a handshake.
        relay.connect(side);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [relay]);

  useEffect(() => {
    isDarkRef.current = isDark;
    postChannelEvent(vueFrame.current?.contentWindow, DARK_MODE_EVENT_NAME, [isDark]);
    postChannelEvent(reactFrame.current?.contentWindow, DARK_MODE_EVENT_NAME, [isDark]);
  }, [isDark]);

  const initialArgs = vue?.initialArgs ?? {};
  const values = { ...initialArgs, ...overrides };
  const args = overridesParam(overrides);
  const overridden = new Set(Object.keys(overrides));
  // Storybook silently drops a URL arg the story doesn't declare, or can't map
  // to the arg's type (e.g. a React prop typed `X | null`); a story can also
  // ignore an arg it received. Either way, that frame doesn't show the change.
  const notApplied = (side: Side) => {
    const frameArgs = applied[side];
    if (!frameArgs) return [];
    return [...overridden].filter(key => !sameValue(frameArgs[key], overrides[key]));
  };
  const changeArgs = (next: Args) => {
    setOverrides(next);
    // A changed args string reloads both frames, so their earlier reports no
    // longer apply. An unchanged one (Storybook's encoding dropped the value)
    // reloads nothing: keep the reports, so a dropped value shows up as not applied.
    if (overridesParam(next) !== args) setApplied({});
  };
  const showControls = vue && !vue.parameters?.controls?.disable;
  const chip = syncOn ? syncChip(reactStatus, relayStatus) : null;

  const pane = (side: Side, label: string) => {
    const frame = side === 'vue' ? vueFrame : reactFrame;
    const viewport = side === 'vue' ? vueViewport : reactViewport;
    return (
      <div className="compare__pane">
        <div className="compare__pane-header">
          <strong>{label}</strong>
          {side === 'vue' && chip && <SyncStatus chip={chip} />}
          <a href={storybookUrl(side, storyId, args, globals)} target="_blank" rel="noreferrer">
            Open in {label} Storybook ({where(side)})
          </a>
        </div>
        {side === 'react' && reactStatus !== 'ported'
          ? <NotPorted status={reactStatus} storyId={storyId} lookalikes={lookalikes} />
          : (
            <div ref={viewport} className="compare__viewport">
              <iframe
                ref={frame}
                className="compare__frame"
                title={`${label}: ${storyId}`}
                src={iframeUrl(side, storyId, args, globals)}
                // A new document (args reload both frames) has a new, inert agent.
                onLoad={() => relay.frameLoaded(side)}
              />
              {canSync && (
                <MirroredCursor
                  relay={relay}
                  side={side}
                  frame={frame}
                  viewport={viewport}
                  highContrast={globals.contrast === 'high'}
                />
              )}
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="compare" data-story-id={storyId}>
      <div className="compare__panes">
        {pane('vue', 'Vue')}
        {pane('react', 'React')}
      </div>
      {showControls && (
        <ArgControls
          argTypes={vue.argTypes}
          values={values}
          overridden={overridden}
          notApplied={{
            vue: notApplied('vue'),
            react: reactStatus === 'ported' ? notApplied('react') : [],
          }}
          onChange={(key, value) => changeArgs({ ...overrides, [key]: value })}
          onReset={() => changeArgs({})}
        />
      )}
    </div>
  );
}

function SyncStatus ({ chip }: { chip: SyncChip }) {
  return (
    <span className="compare__sync" data-tone={chip.tone} title={chip.title}>{chip.text}</span>
  );
}

// The phantom cursor over this side's frame, when the real pointer is in the
// other. It subscribes to the relay itself, so a move re-renders only it.
function MirroredCursor ({ relay, side, frame, viewport, highContrast }: {
  relay: SyncRelay;
  side: Side;
  frame: RefObject<HTMLIFrameElement | null>;
  viewport: RefObject<HTMLDivElement | null>;
  highContrast: boolean;
}) {
  const cursor = useSyncExternalStore(relay.subscribeCursor, relay.getCursor);
  if (cursor?.over !== side || !frame.current || !viewport.current) return null;
  const offset = frameOffset(boxOf(frame.current), boxOf(viewport.current));
  return (
    <SyncCursor
      mirrors={cursor.mirrors}
      x={offset.x + cursor.x}
      y={offset.y + cursor.y}
      pressed={cursor.pressed}
      bounds={{ width: viewport.current.clientWidth, height: viewport.current.clientHeight }}
      highContrast={highContrast}
    />
  );
}

// Args arrive JSON-encoded, so undefined values are simply absent.
const sameValue = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

// The CSF file's name without folders, extension or separators, so Vue's
// `components/input_group/input_group.stories.js` matches React's
// `components/InputGroup/InputGroup.stories.tsx`.
const fileKey = (importPath: string) =>
  (importPath.split('/').pop() ?? '').replace(/\.stories\..*$/, '').replace(/[^a-z0-9]/gi, '').toLowerCase();

// React ids under the same component id, title or story file as the Vue story:
// most likely the port with a wrong title or export name.
function findLookalikes (stories: Map<string, IndexedStory>, vue: IndexedStory) {
  const componentId = vue.id.split('--')[0];
  const file = fileKey(vue.importPath);
  return [...stories.values()]
    .filter(story => story.id.split('--')[0] === componentId ||
      story.title === vue.title ||
      fileKey(story.importPath) === file)
    .map(story => story.id);
}

function NotPorted ({ status, storyId, lookalikes }: { status: ReactStatus; storyId: string; lookalikes: string[] }) {
  if (status === 'checking') return <div className="compare__empty" />;
  return (
    <div className="compare__empty" data-react-status={status}>
      {status === 'missing'
        ? (
          <>
            <strong>Not ported yet</strong>
            <span>The React Storybook has no story <code>{storyId}</code>.</span>
            {lookalikes.length > 0 && (
              <span data-react-lookalikes>
                React has: {lookalikes.map((id, i) => <span key={id}>{i > 0 && ', '}<code>{id}</code></span>)}.
                {' '}If one of these is this story, its title or export name doesn't match Vue's.
              </span>
            )}
          </>
        )
        : (
          <>
            <strong>React Storybook not running</strong>
            <span>
              {isPublished
                ? <>Nothing answers at <code>{where('react')}</code>, next to this Storybook. The published bundle should include it.</>
                : <>
                  Nothing answers on {where('react')}. Start it with <code>pnpm nx run dialtone-react:storybook</code>;
                  {' '}this pane picks it up once it answers.
                </>}
            </span>
          </>
        )}
    </div>
  );
}
