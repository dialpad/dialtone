import { ref, onMounted, onUnmounted } from 'vue';

// ─── Announcements (merged from useResizableAnnouncements) ────────────────

let announcementElement: HTMLElement | null = null;
let announcementTimeout: ReturnType<typeof setTimeout> | undefined;
let announcementRefCount = 0;

function getAnnouncementElement(): HTMLElement {
  if (!announcementElement) {
    announcementElement = document.getElementById('dt-resizable-announcements');

    if (!announcementElement) {
      announcementElement = document.createElement('div');
      announcementElement.id = 'dt-resizable-announcements';
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

function createInstructions(): void {
  if (document.getElementById('dt-resize-instructions')) return;

  const instructions = document.createElement('div');
  instructions.id = 'dt-resize-instructions';
  instructions.style.position = 'absolute';
  instructions.style.left = '-10000px';
  instructions.style.width = '1px';
  instructions.style.height = '1px';
  instructions.style.overflow = 'hidden';
  instructions.innerHTML = `
    <div>
      <p><strong>Panel Edit Mode:</strong></p>
      <ul>
        <li>Press Ctrl+E (or Cmd+E on Mac) to enter/exit panel edit mode</li>
        <li>In edit mode, use Tab to navigate between resize handles</li>
        <li>Press Escape to exit edit mode</li>
      </ul>
      <p><strong>Resize Controls:</strong></p>
      <ul>
        <li>Arrow keys: Normal resize (8px increments)</li>
        <li>Shift + Arrow keys: Large resize (24px increments)</li>
        <li>Ctrl/Cmd + Arrow keys: Fine resize (1px increments)</li>
      </ul>
      <p><strong>Reset Controls:</strong></p>
      <ul>
        <li>R: Reset current handle's panels to initial sizes</li>
        <li>Ctrl/Cmd + R: Reset all visible panels to initial sizes</li>
      </ul>
    </div>
  `;
  document.body.appendChild(instructions);
}

// ─── Global edit mode state (shared across all ResizableGroups) ───────────

const globalEditMode = {
  isActive: ref(false),
  availableHandles: ref<HTMLElement[]>([]),
  currentHandleIndex: ref(0),
  keydownListener: null as ((event: KeyboardEvent) => void) | null,
};

// ─── Helper: extract panel IDs from composite handle ID ───────────────────

function extractPanelIds(
  handleId: string,
  availablePanelIds: string[],
): { beforePanelId: string | null; afterPanelId: string | null } {
  for (const panelId of availablePanelIds) {
    if (handleId.startsWith(panelId + ':')) {
      return {
        beforePanelId: panelId,
        afterPanelId: handleId.substring(panelId.length + 1),
      };
    }
  }
  return { beforePanelId: null, afterPanelId: null };
}

function arePanelsVisible(
  container: Element,
  beforePanelId: string,
  afterPanelId: string,
): boolean {
  const beforePanel = container.querySelector(
    `[data-panel-id="${beforePanelId}"]`,
  ) as HTMLElement;
  const afterPanel = container.querySelector(
    `[data-panel-id="${afterPanelId}"]`,
  ) as HTMLElement;

  if (!beforePanel || !afterPanel) return false;

  const beforeVisible =
    beforePanel.offsetParent !== null ||
    beforePanel.getBoundingClientRect().width > 0;
  const afterVisible =
    afterPanel.offsetParent !== null ||
    afterPanel.getBoundingClientRect().width > 0;

  return beforeVisible && afterVisible;
}

// ─── Composable ───────────────────────────────────────────────────────────

export function useResizableEditMode() {
  function registerHandle(handleElement: HTMLElement): void {
    if (!globalEditMode.availableHandles.value.includes(handleElement)) {
      globalEditMode.availableHandles.value.push(handleElement);
    }
  }

  function unregisterHandle(handleElement: HTMLElement): void {
    const index = globalEditMode.availableHandles.value.indexOf(handleElement);
    if (index > -1) {
      globalEditMode.availableHandles.value.splice(index, 1);
      if (
        globalEditMode.currentHandleIndex.value >=
        globalEditMode.availableHandles.value.length
      ) {
        globalEditMode.currentHandleIndex.value = Math.max(
          0,
          globalEditMode.availableHandles.value.length - 1,
        );
      }
    }
  }

  /**
   * Get handles that have valid data-handle-id and visible adjacent panels.
   */
  function getValidHandles(): HTMLElement[] {
    return globalEditMode.availableHandles.value.filter((handle) => {
      const handleId = handle.getAttribute('data-handle-id');
      if (!handleId || handleId === 'temp-handle') return false;

      const container = handle.closest('.dt-resizable');
      if (!container) return false;

      const allPanelElements = container.querySelectorAll('[data-panel-id]');
      const availablePanelIds = Array.from(allPanelElements)
        .map((el) => el.getAttribute('data-panel-id'))
        .filter(Boolean) as string[];

      const { beforePanelId, afterPanelId } = extractPanelIds(
        handleId,
        availablePanelIds,
      );
      if (!beforePanelId || !afterPanelId) return false;

      return arePanelsVisible(container, beforePanelId, afterPanelId);
    });
  }

  function focusHandleAtIndex(
    targetIndex: number,
    validHandles: HTMLElement[],
  ): void {
    globalEditMode.availableHandles.value.forEach((handle) => {
      handle.setAttribute('tabindex', '-1');
    });

    validHandles[targetIndex].setAttribute('tabindex', '0');
    validHandles[targetIndex].focus();
    globalEditMode.currentHandleIndex.value = targetIndex;
  }

  function getCurrentResolvedIndex(validHandles: HTMLElement[]): number {
    const activeElement = document.activeElement as HTMLElement | null;
    const currentIndex = activeElement
      ? validHandles.indexOf(activeElement)
      : -1;
    return currentIndex >= 0
      ? currentIndex
      : globalEditMode.currentHandleIndex.value;
  }

  function enterEditMode(): void {
    if (globalEditMode.isActive.value) return;

    const validHandles = getValidHandles();

    if (validHandles.length === 0) {
      announce(
        'Panel edit mode activated, but no resize handles are available.',
      );
      return;
    }

    globalEditMode.isActive.value = true;
    globalEditMode.currentHandleIndex.value = 0;

    focusHandleAtIndex(0, validHandles);
    announce(
      `Panel edit mode activated. Use Tab/Shift+Tab to navigate between ${validHandles.length} resize handles. Press Escape to exit.`,
    );
  }

  function exitEditMode(): void {
    if (!globalEditMode.isActive.value) return;

    globalEditMode.isActive.value = false;
    globalEditMode.currentHandleIndex.value = 0;

    globalEditMode.availableHandles.value.forEach((handle) => {
      handle.setAttribute('tabindex', '-1');
    });

    if (
      document.activeElement &&
      globalEditMode.availableHandles.value.includes(
        document.activeElement as HTMLElement,
      )
    ) {
      (document.activeElement as HTMLElement).blur();
    }

    announce('Panel edit mode deactivated.');
  }

  function focusNextHandle(): void {
    if (!globalEditMode.isActive.value) return;

    const validHandles = getValidHandles();
    if (validHandles.length === 0) return;

    const resolvedIndex = getCurrentResolvedIndex(validHandles);
    const nextIndex = (resolvedIndex + 1) % validHandles.length;
    focusHandleAtIndex(nextIndex, validHandles);
  }

  function focusPreviousHandle(): void {
    if (!globalEditMode.isActive.value) return;

    const validHandles = getValidHandles();
    if (validHandles.length === 0) return;

    const resolvedIndex = getCurrentResolvedIndex(validHandles);
    const prevIndex =
      resolvedIndex === 0 ? validHandles.length - 1 : resolvedIndex - 1;
    focusHandleAtIndex(prevIndex, validHandles);
  }

  // ─── Reset support ────────────────────────────────────────────────────

  function dispatchResetEvent(
    container: Element,
    currentHandle: HTMLElement,
  ): void {
    container.dispatchEvent(
      new CustomEvent('resizable-reset-request', {
        detail: { handleElement: currentHandle, resetType: 'current' },
      }),
    );
  }

  function announceReset(container: Element, handleId: string): void {
    const allPanelElements = container.querySelectorAll('[data-panel-id]');
    const availablePanelIds = Array.from(allPanelElements)
      .map((el) => el.getAttribute('data-panel-id'))
      .filter(Boolean) as string[];

    const { beforePanelId, afterPanelId } = extractPanelIds(
      handleId,
      availablePanelIds,
    );
    if (beforePanelId && afterPanelId) {
      announce(
        `Reset panels: ${beforePanelId} and ${afterPanelId} to initial sizes.`,
      );
    }
  }

  function resetCurrentHandle(): void {
    if (!globalEditMode.isActive.value) return;

    const validHandles = getValidHandles();
    const currentIndex = getCurrentResolvedIndex(validHandles);
    const currentHandle = validHandles[currentIndex];
    if (!currentHandle) return;

    const container = currentHandle.closest('.dt-resizable');
    if (!container) return;

    dispatchResetEvent(container, currentHandle);

    const handleId = currentHandle.getAttribute('data-handle-id');
    if (handleId) announceReset(container, handleId);
  }

  function resetAllVisiblePanels(): void {
    if (!globalEditMode.isActive.value) return;

    const containers = document.querySelectorAll('.dt-resizable');
    containers.forEach((container) => {
      container.dispatchEvent(
        new CustomEvent('resizable-reset-request', {
          detail: { resetType: 'all' },
        }),
      );
    });

    announce('Reset all visible panels to their initial sizes.');
  }

  // ─── Global keyboard handler ──────────────────────────────────────────

  function handleEditModeToggle(event: KeyboardEvent): boolean {
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === 'e'
    ) {
      event.preventDefault();
      if (!globalEditMode.isActive.value) {
        enterEditMode();
      } else {
        exitEditMode();
      }
      return true;
    }
    return false;
  }

  function handleResetKey(event: KeyboardEvent): boolean {
    event.preventDefault();
    if (event.ctrlKey || event.metaKey) {
      resetAllVisiblePanels();
    } else {
      resetCurrentHandle();
    }
    return true;
  }

  function handleEditModeNavigation(event: KeyboardEvent): boolean {
    if (!globalEditMode.isActive.value) return false;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        exitEditMode();
        return true;

      case 'Tab':
        event.preventDefault();
        if (event.shiftKey) {
          focusPreviousHandle();
        } else {
          focusNextHandle();
        }
        return true;

      case 'r':
      case 'R':
        return handleResetKey(event);
    }
    return false;
  }

  function handleGlobalKeydown(event: KeyboardEvent): void {
    if (handleEditModeToggle(event)) return;
    handleEditModeNavigation(event);
  }

  function handleDocumentClick(event: Event): void {
    if (!globalEditMode.isActive.value) return;

    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (!target.closest('.dt-resizable-handle')) {
      exitEditMode();
    }
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────

  onMounted(() => {
    announcementRefCount++;
    createInstructions();

    if (!globalEditMode.keydownListener) {
      globalEditMode.keydownListener = handleGlobalKeydown;
      document.addEventListener('keydown', globalEditMode.keydownListener);
      document.addEventListener('click', handleDocumentClick, true);
    }
  });

  onUnmounted(() => {
    if (announcementTimeout) {
      clearTimeout(announcementTimeout);
    }

    if (globalEditMode.keydownListener === handleGlobalKeydown) {
      document.removeEventListener('keydown', globalEditMode.keydownListener);
      document.removeEventListener('click', handleDocumentClick, true);
      globalEditMode.keydownListener = null;
    }

    announcementRefCount--;
    if (announcementRefCount <= 0 && announcementElement) {
      announcementElement.remove();
      announcementElement = null;
      announcementRefCount = 0;
    }
  });

  return {
    isEditMode: globalEditMode.isActive,
    availableHandles: globalEditMode.availableHandles,
    currentHandleIndex: globalEditMode.currentHandleIndex,
    announce,
    enterEditMode,
    exitEditMode,
    focusNextHandle,
    focusPreviousHandle,
    registerHandle,
    unregisterHandle,
  };
}
