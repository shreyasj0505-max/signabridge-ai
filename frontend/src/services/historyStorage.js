/**
 * SignaBridge AI - Translation History Storage Manager
 * Saves completed gesture translations to localStorage with timestamps and confidence scores.
 */

const STORAGE_KEY = "signabridge_translation_history";

export const historyStorage = {
  getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load translation history:", e);
      return [];
    }
  },

  addEntry({ text, signs = [], confidence = 95, mode = "live_camera" }) {
    if (!text || text.trim() === "") return null;

    try {
      const history = this.getHistory();
      const newEntry = {
        id: "trans_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        text: text.trim(),
        signs: Array.isArray(signs) ? signs : [signs],
        confidence: Math.round(confidence),
        mode,
        timestamp: new Date().toISOString(),
        formattedDate: new Date().toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })
      };

      const updated = [newEntry, ...history].slice(0, 150); // Keep last 150 items
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return newEntry;
    } catch (e) {
      console.error("Failed to save translation entry:", e);
      return null;
    }
  },

  deleteEntry(id) {
    try {
      const history = this.getHistory();
      const updated = history.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error("Failed to delete entry:", e);
      return [];
    }
  },

  clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (e) {
      console.error("Failed to clear history:", e);
      return false;
    }
  },

  exportJSON() {
    const history = this.getHistory();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `signabridge_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
};
