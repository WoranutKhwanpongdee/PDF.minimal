export type HistoryItem = {
  id: string;
  action: string;
  filename: string;
  date: string;
  timestamp: number;
};

export type Settings = {
  defaultPrefix: string;
};

const HISTORY_KEY = "pdf_minimal_history";
const SETTINGS_KEY = "pdf_minimal_settings";

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addHistory(action: string, filename: string) {
  if (typeof window === "undefined") return;
  const history = getHistory();
  const newItem: HistoryItem = {
    id: crypto.randomUUID(),
    action,
    filename,
    date: new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short", year: "numeric" }).format(new Date()),
    timestamp: Date.now(),
  };
  localStorage.setItem(HISTORY_KEY, JSON.stringify([newItem, ...history]));
}

export function removeHistoryItem(id: string) {
  if (typeof window === "undefined") return;
  const history = getHistory();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.filter(h => h.id !== id)));
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}

export function getSettings(): Settings {
  if (typeof window === "undefined") return { defaultPrefix: "" };
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : { defaultPrefix: "" };
  } catch {
    return { defaultPrefix: "" };
  }
}

export function saveSettings(settings: Settings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function applyPrefix(filename: string): string {
  const { defaultPrefix } = getSettings();
  if (!defaultPrefix) return filename;
  return `${defaultPrefix}${filename}`;
}
