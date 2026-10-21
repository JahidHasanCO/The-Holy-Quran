/** Named starting states (?view=...). Each lists only what differs from the defaults. */
export const DEFAULT_BOARD = {
  "layout": "auto",
  "theme": "paper",
  "startPage": 50,
  "startMode": "book",
  "startPanel": "none",
  "startSide": "",
  "selKey": "",
  "selWord": 0,
  "playKey": "",
  "practiceKey": "",
  "practiceStage": "idle",
  "signedIn": false,
  "startBook": "open"
};

export const BOARDS = {
  "cover": {"startBook":"closed"},
  "reading": {},
  "word": {"startSide":"word","selKey":"3:2","playKey":"3:3"},
  "practice": {"startPage":1,"startSide":"practice","practiceKey":"1:7","practiceStage":"result"},
  "signin": {"startPage":293,"startPanel":"signin"},
  "phone-cover": {"layout":"single","startBook":"closed"},
  "phone": {"layout":"single","startPage":3},
  "phone-words": {"layout":"single","theme":"night","startPage":604,"startMode":"wbw","playKey":"113:2","signedIn":true},
  "phone-practice": {"layout":"single","startPage":604,"startSide":"practice","practiceKey":"112:1","practiceStage":"listening"},
};
