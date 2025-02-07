export type Action =
  | NavigateAction
  | ClickAction
  | TypeAction
  | SelectAction
  | ScrollAction
  | WaitAction
  | StopAction
  | KeyPressAction;

type NavigateAction = {
  type: "navigate";
  url: string;
  thought: string;
};
type ClickAction = {
  type: "click";
  node: number;
  thought: string;
};
type TypeAction = {
  type: "type";
  node: number;
  value: string;
  thought: string;
};
type SelectAction = {
  type: "select";
  node: number;
  value: string;
  thought: string;
};
type ScrollAction = {
  type: "scroll";
  amount: number;
  thought: string;
};
type WaitAction = {
  type: "wait";
  amount: number;
  thought: string;
};
type StopAction = {
  type: "stop";
  thought: string;
};
type KeyPressAction = {
  type: "press";
  key:
    | "Abort"
    | "Help"
    | "Backspace"
    | "Tab"
    | "Numpad5"
    | "NumpadEnter"
    | "Enter"
    | "\r"
    | "\n"
    | "ShiftLeft"
    | "ShiftRight"
    | "ControlLeft"
    | "ControlRight"
    | "AltLeft"
    | "AltRight"
    | "Pause"
    | "CapsLock"
    | "Escape"
    | "Convert"
    | "NonConvert"
    | "Space"
    | "Numpad9"
    | "PageUp"
    | "Numpad3"
    | "PageDown"
    | "End"
    | "Numpad1"
    | "Home"
    | "Numpad7"
    | "ArrowLeft"
    | "Numpad4"
    | "Numpad8"
    | "ArrowUp"
    | "ArrowRight"
    | "Numpad6"
    | "Numpad2"
    | "ArrowDown"
    | "Select"
    | "Open"
    | "PrintScreen"
    | "Insert"
    | "Numpad0"
    | "Delete"
    | "NumpadDecimal"
    | "MetaLeft"
    | "MetaRight"
    | "ContextMenu"
    | "NumpadMultiply"
    | "NumpadAdd"
    | "NumpadSubtract"
    | "NumpadDivide"
    | "NumLock"
    | "ScrollLock"
    | "AudioVolumeMute"
    | "AudioVolumeDown"
    | "AudioVolumeUp"
    | "MediaTrackNext"
    | "MediaTrackPrevious"
    | "MediaStop"
    | "MediaPlayPause"
    | "Semicolon"
    | "Equal"
    | "NumpadEqual"
    | "Comma"
    | "Minus"
    | "Period"
    | "Slash"
    | "Backquote"
    | "BracketLeft"
    | "Backslash"
    | "BracketRight"
    | "Quote"
    | "AltGraph"
    | "Props"
    | "Cancel"
    | "Clear"
    | "Shift"
    | "Control"
    | "Alt"
    | "Accept"
    | "ModeChange"
    | " "
    | "Print"
    | "Execute"
    | "Attn"
    | "CrSel"
    | "ExSel"
    | "EraseEof"
    | "Play"
    | "ZoomOut"
    | "SoftLeft"
    | "SoftRight"
    | "Camera"
    | "Call"
    | "EndCall"
    | "VolumeDown"
    | "VolumeUp";
  thought: string;
};

export type InteractableElement = {
  tag: string;
  selector: string;
  attributes: {
    [k: string]: string | null;
  };
  text: string;
};

export type ActionHistory = Action & { title: string; url: string };
