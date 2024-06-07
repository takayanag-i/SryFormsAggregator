const Constants = {
  SHEET: {
    MASTER: 'マスター',
    DATA: '演習状況',
  },
  DATA_RANGE: {
    RECORD_START_ROW: 3, //レコードが始まる行番号
    NUM_ROWS: 282,
    EMAIL_COL: 1, //emailが格納されているカラム
    FORM_DATA_START_ROW: 10,
    FORM_DATA_NUM_ROWS: 19,
    FORM_DATA_NUM_COLS: 2,
    START_COL: 4,
  },
  MASTER_RANGE: {
    CORRECT_ANSWER_ROW: 3,
    FORM_DATA_START_ROW: 10,
    FORM_DATA_START_COL: 1,
    FORM_DATA_NUM_ROWS: 19,
    FORM_DATA_NUM_COLS: 2,
  },
  SYMBOLS: {
    CORRECT: '〇',
  },
};

module.exports = Constants;
