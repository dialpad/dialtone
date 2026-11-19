import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../common/cx';
import { useI18n } from '../../common/localization';
import type { IconSize } from '../../icons';
import { LOADER_KIND_MODIFIERS, type LoaderKind } from './LoaderConstants';

interface DtLoaderOwnProps {
  /**
   * The label of the loader as read out by a screen reader.
   * Defaults to the localized loading message.
   */
  ariaLabel?: string;

  /**
   * The visual style of the loader: the four-dot loader, or the circular spinner.
   * @values dots, spinner
   */
  kind?: LoaderKind;

  /**
   * The size of the icon.
   * @values 100, 200, 300, 400, 500, 600, 700, 800
   */
  size?: IconSize;
}

export type DtLoaderProps = DtLoaderOwnProps & Omit<ComponentPropsWithRef<'div'>, keyof DtLoaderOwnProps>;

// Path data laid out as Vue's template leaves it, with its line breaks and indentation, so the DOM is identical.
const pathData = (...lines: string[]) => `\n${lines.map(line => `            ${line}`).join('\n')}\n          `;

const TRACK_PATH = pathData(
  'M12 0.0180664C18.6175 0.0180664 23.9819 5.38305 23.9819',
  '12.0005C23.9819 18.6177 18.6175 23.9819 12 23.9819C5.38281',
  '23.9819 0.0180664 18.6177 0.0180664 12.0005C0.0180664',
  '5.38305 5.38281 0.0180664 12 0.0180664ZM12 3.26807C7.17773',
  '3.26807 3.26807 7.17797 3.26807 12.0005C3.26807 16.8228',
  '7.17773 20.7319 12 20.7319C16.8223 20.7319 20.7319 16.8228',
  '20.7319 12.0005C20.7319 7.17797 16.8223 3.26807 12 3.26807Z',
);

const SPINNER_PATH = pathData(
  'M0.0180664 12.0005',
  'C0.0180664 5.38305 5.38305 0.0180664 12.0005 0.0180664',
  'C12.8977 0.0183302 13.6255 0.745766 13.6255 1.64307',
  'C13.6255 2.54037 12.8977 3.2678 12.0005 3.26807',
  'C7.17797 3.26807 3.26807 7.17797 3.26807 12.0005',
  'C3.26833 16.8228 7.17814 20.7319 12.0005 20.7319',
  'C16.8226 20.7317 20.7317 16.8226 20.7319 12.0005',
  'C20.7319 11.103 21.4595 10.3755 22.3569 10.3755',
  'C23.2544 10.3755 23.9819 11.103 23.9819 12.0005',
  'C23.9817 18.6175 18.6175 23.9817 12.0005 23.9819',
  'C5.38321 23.9819 0.0183303 18.6177 0.0180664 12.0005Z',
);

/**
 * A loader is a looping animation that indicates content is in the process of loading.
 * @see https://dialtone.dialpad.com/components/loader.html
 */
export function DtLoader ({
  ariaLabel = '',
  kind = 'dots',
  size = 500,
  className,
  'aria-label': ariaLabelAttribute,
  role,
  ...rest
}: DtLoaderProps) {
  const i18n = useI18n();
  const isSpinner = kind === 'spinner';
  const isPresentational = role === 'none' || role === 'presentation';
  // The ariaLabel prop wins over a forwarded aria-label, as in Vue's rendered output.
  const accessibleLabel = isPresentational ? undefined : ariaLabel || ariaLabelAttribute || i18n.$t('DIALTONE_LOADING');
  const loaderKindClass = isSpinner ? LOADER_KIND_MODIFIERS.spinner : LOADER_KIND_MODIFIERS.dots;
  const iconClass = (name: string) => cx('d-icon', `d-icon--size-${size}`, name);

  return (
    <div
      className={cx('d-loader', loaderKindClass, className)}
      aria-label={accessibleLabel}
      data-qa="dt-loader"
      {...rest}
      role={role ?? 'img'}
    >
      {isSpinner ? (
        <>
          <svg
            className={iconClass('d-loader__icon-track')}
            data-qa="dt-loader-icon-track"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d={TRACK_PATH} />
          </svg>
          <svg
            className={iconClass('d-loader__icon')}
            data-qa="dt-loader-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d={SPINNER_PATH} />
          </svg>
        </>
      ) : (
        <svg
          className={iconClass('d-loader__icon')}
          data-qa="dt-loader-icon"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/*
            Rest positions and radii in the 24-unit viewBox. They must stay in sync
            with the keyframes in loader.less, which include a 5% outward spread and
            a 0.9655 scale on top of the Figma spec.
          */}
          <circle className="d-loader__dot d-loader__dot--1" data-qa="dt-loader-dot" cx="14.843" cy="9.471" r="2.410" />
          <circle className="d-loader__dot d-loader__dot--2" data-qa="dt-loader-dot" cx="9.156" cy="15.199" r="2.410" />
          <circle className="d-loader__dot d-loader__dot--3" data-qa="dt-loader-dot" cx="15.469" cy="15.743" r="3.647" />
          <circle className="d-loader__dot d-loader__dot--4" data-qa="dt-loader-dot" cx="8.539" cy="8.915" r="3.647" />
        </svg>
      )}
    </div>
  );
}
