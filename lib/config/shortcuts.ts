export interface Shortcut {
  id: string;
  label: string;
  category: "navigation" | "action";
  ctrlKey?: string;
  seqKey?: string;
  singleKeys?: string[];
  displayKeys: string[][];
}

export const SHORTCUTS: Shortcut[] = [
  {
    id: "INBOX",
    label: "Go to Inbox",
    category: "navigation",
    ctrlKey: "i",
    seqKey: "i",
    displayKeys: [["Ctrl", "I"], ["g", "i"]]
  },
  {
    id: "STARRED",
    label: "Go to Starred",
    category: "navigation",
    ctrlKey: "s",
    seqKey: "s",
    displayKeys: [["Ctrl", "S"], ["g", "s"]]
  },
  {
    id: "SENT",
    label: "Go to Sent",
    category: "navigation",
    ctrlKey: "e",
    seqKey: "e",
    displayKeys: [["Ctrl", "E"], ["g", "e"]]
  },
  {
    id: "DRAFT",
    label: "Go to Drafts",
    category: "navigation",
    ctrlKey: "d",
    seqKey: "d",
    displayKeys: [["Ctrl", "D"], ["g", "d"]]
  },
  {
    id: "ARCHIVE",
    label: "Go to Archive",
    category: "navigation",
    seqKey: "r",
    displayKeys: [["g", "r"]]
  },
  {
    id: "PURCHASES",
    label: "Go to Purchases",
    category: "navigation",
    ctrlKey: "p",
    seqKey: "p",
    displayKeys: [["Ctrl", "P"], ["g", "p"]]
  },
  {
    id: "CALENDAR",
    label: "Go to Calendar",
    category: "navigation",
    ctrlKey: "z",
    seqKey: "z",
    displayKeys: [["Ctrl", "Z"], ["g", "z"]]
  },
  {
    id: "AGENTS",
    label: "Go to Agents",
    category: "navigation",
    ctrlKey: "a",
    seqKey: "a",
    displayKeys: [["Ctrl", "A"], ["g", "a"]]
  },
  {
    id: "SETTINGS",
    label: "Go to Settings",
    category: "navigation",
    ctrlKey: "o",
    seqKey: "o",
    displayKeys: [["Ctrl", "O"], ["g", "o"]]
  },
  {
    id: "COMPOSE",
    label: "Compose New Email",
    category: "action",
    singleKeys: ["n"],
    displayKeys: [["n"]]
  },
  {
    id: "HELP",
    label: "Toggle Help Dialog",
    category: "action",
    singleKeys: ["?", "h"],
    displayKeys: [["?"], ["h"]]
  },
  {
    id: "CLOSE",
    label: "Close Panel / Modal",
    category: "action",
    singleKeys: ["escape"],
    displayKeys: [["Esc"]]
  }
];
