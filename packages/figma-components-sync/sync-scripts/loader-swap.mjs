/**
 * While a DtButton is loading, `.d-loader` is an INSTANCE of the real DtLoader (built as its own set),
 * not re-measured anatomy: the spinner's look comes from a CSS mask nothing here can reproduce.
 *
 * Button, ButtonIcon and ButtonLink all swap to it, so the Button-to-Loader size map lives here once.
 * Loader has its own 100-800 scale, and Button's two smallest sizes both use Loader's 200. DtLoader
 * must be built BEFORE any set that swaps to it (run-batch refuses a batch that holds both).
 */
export const LOADER_SIZE_FOR_BUTTON = { 100: 200, 200: 200, 300: 300, 400: 400, 500: 500 };

/** `anatomySwap` for a config whose combo carries Button's `size`. */
export const loaderSwap = (c) => ({
  selector: 'd-loader',
  component: 'loader',
  variant: { size: LOADER_SIZE_FOR_BUTTON[c.size] },
});
