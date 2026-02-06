// Utility: Delays function execution until user stops typing
export class TypingDelayManager {
  private timerId: NodeJS.Timeout | null = null;
  
  scheduleUpdate(callback: () => void, delayMs: number) {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    this.timerId = setTimeout(callback, delayMs);
  }
  
  cancelPending() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}

// Utility: Manages keyboard focus in lists
export class FocusTracker {
  private currentIdx: number = -1;
  
  moveNext(totalItems: number): number {
    if (totalItems === 0) {
      return -1;
    }
    this.currentIdx = this.currentIdx >= totalItems - 1 ? 0 : this.currentIdx + 1;
    return this.currentIdx;
  }
  
  movePrevious(totalItems: number): number {
    if (totalItems === 0) {
      return -1;
    }
    this.currentIdx = this.currentIdx <= 0 ? totalItems - 1 : this.currentIdx - 1;
    return this.currentIdx;
  }
  
  reset() {
    this.currentIdx = -1;
  }
  
  getCurrent(): number {
    return this.currentIdx;
  }
  
  setCurrent(idx: number) {
    this.currentIdx = idx;
  }
}
