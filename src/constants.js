/**
 * Copyright 2024 takayanag-i
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export const Constants = {
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
