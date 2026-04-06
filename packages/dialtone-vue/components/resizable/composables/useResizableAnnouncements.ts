import { onMounted, onUnmounted } from 'vue';

// ─── Announcements (aria-live singleton with ref counting) ───────────────

let announcementElement: HTMLElement | null = null;
let announcementTimeout: ReturnType<typeof setTimeout> | undefined;
let announcementRefCount = 0;

function getAnnouncementElement(): HTMLElement {
  if (!announcementElement) {
    announcementElement = document.getElementById('d-resizable-announcements');

    if (!announcementElement) {
      announcementElement = document.createElement('div');
      announcementElement.id = 'd-resizable-announcements';
      announcementElement.setAttribute('aria-live', 'polite');
      announcementElement.setAttribute('aria-atomic', 'true');
      announcementElement.style.position = 'absolute';
      announcementElement.style.left = '-10000px';
      announcementElement.style.width = '1px';
      announcementElement.style.height = '1px';
      announcementElement.style.overflow = 'hidden';
      document.body.appendChild(announcementElement);
    }
  }
  return announcementElement;
}

function announce(message: string): void {
  if (!message.trim()) return;

  if (announcementTimeout) {
    clearTimeout(announcementTimeout);
  }

  const element = getAnnouncementElement();
  element.textContent = '';

  announcementTimeout = setTimeout(() => {
    element.textContent = message;
    setTimeout(() => { element.textContent = ''; }, 1000);
  }, 100);
}

// ─── Composable ───────────────────────────────────────────────────────────

/**
 * Manages a shared aria-live announcements region for all DtResizable
 * instances. Uses ref counting to create/destroy the singleton DOM element.
 */
export function useResizableAnnouncements() {
  onMounted(() => {
    announcementRefCount++;
    getAnnouncementElement();
  });

  onUnmounted(() => {
    if (announcementTimeout) {
      clearTimeout(announcementTimeout);
    }

    announcementRefCount--;
    if (announcementRefCount <= 0 && announcementElement) {
      announcementElement.remove();
      announcementElement = null;
      announcementRefCount = 0;
    }
  });

  return { announce };
}
