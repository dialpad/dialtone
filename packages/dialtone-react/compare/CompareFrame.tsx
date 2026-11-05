// Vue and React side by side: one story id, the same URL args and the same
// theme and contrast globals in both frames. Dark mode isn't a global in
// either Storybook (it's the dark-mode addon's event), so it's posted into
// each frame once it renders.
import { useEffect, useRef, useState } from 'react';
import { addons } from 'storybook/preview-api';
import { DARK_MODE_EVENT_NAME } from '@vueless/storybook-dark-mode';
import { ArgControls } from './ArgControls';
import type { ArgType } from './ArgControls';
import {
  argsParam,
  fetchStories,
  iframeUrl,
  parseChannelMessage,
  postChannelEvent,
  storybookUrl,
} from './frames';
import type { Args, IndexedStory, Side } from './frames';
import ports from './ports.json';
import { readStoredDarkMode } from './darkMode';

interface Prepared {
  args: Args;
  initialArgs: Args;
  argTypes: Record<string, ArgType>;
  parameters?: { controls?: { disable?: boolean } };
}

type ReactStatus = 'checking' | 'ported' | 'missing' | 'unreachable';

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
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

  useEffect(() => {
    let cancelled = false;
    void fetchStories('react').then((stories) => {
      if (cancelled) return;
      setReactStatus(!stories ? 'unreachable' : stories.has(storyId) ? 'ported' : 'missing');
      if (stories && !stories.has(storyId)) {
        setLookalikes(findLookalikes(stories, { id: storyId, title, importPath: vueImportPath }));
      }
    });
    return () => { cancelled = true; };
  }, [storyId, title, vueImportPath]);

  useEffect(() => {
    const sideOf = (source: MessageEventSource | null): Side | null =>
      source === vueFrame.current?.contentWindow ? 'vue'
        : source === reactFrame.current?.contentWindow ? 'react'
          : null;

    const onMessage = (message: MessageEvent) => {
      const side = sideOf(message.source);
      const event = side && parseChannelMessage(message.data);
      if (!side || !event) return;
      if (event.type === 'storyPrepared') {
        const prepared = event.args[0] as Prepared;
        // initialArgs and argTypes don't depend on URL args, so Vue's first
        // report stands; later reloads would only repeat it.
        if (side === 'vue') setVue(current => current ?? prepared);
        setApplied(current => ({ ...current, [side]: prepared.args }));
      }
      if (event.type === 'storyRendered') {
        postChannelEvent(message.source as Window, DARK_MODE_EVENT_NAME, [isDarkRef.current]);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    postChannelEvent(vueFrame.current?.contentWindow, DARK_MODE_EVENT_NAME, [isDark]);
    postChannelEvent(reactFrame.current?.contentWindow, DARK_MODE_EVENT_NAME, [isDark]);
  }, [isDark]);

  const initialArgs = vue?.initialArgs ?? {};
  const values = { ...initialArgs, ...overrides };
  const args = argsParam(initialArgs, values);
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
    // longer apply. An unchanged one (the value equals the story's own, or
    // Storybook's encoding dropped it) reloads nothing: keep the reports, so a
    // dropped value shows up as not applied.
    if (argsParam(initialArgs, { ...initialArgs, ...next }) !== args) setApplied({});
  };
  const showControls = vue && !vue.parameters?.controls?.disable;

  const pane = (side: Side, label: string) => (
    <div className="compare__pane">
      <div className="compare__pane-header">
        <strong>{label}</strong>
        <a href={storybookUrl(side, storyId, args, globals)} target="_blank" rel="noreferrer">
          Open in {label} Storybook (:{ports[side]})
        </a>
      </div>
      {side === 'react' && reactStatus !== 'ported'
        ? <NotPorted status={reactStatus} storyId={storyId} lookalikes={lookalikes} />
        : (
          <iframe
            ref={side === 'vue' ? vueFrame : reactFrame}
            className="compare__frame"
            title={`${label}: ${storyId}`}
            src={iframeUrl(side, storyId, args, globals)}
          />
        )}
    </div>
  );

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
            <span>Nothing answers on :{ports.react}. Start it with <code>pnpm nx run dialtone-react:storybook</code>.</span>
          </>
        )}
    </div>
  );
}
