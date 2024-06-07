const ConstantsClass = require('./constants.js');
const Constants = new ConstantsClass();

const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
const masterSheet = spreadSheet.getSheetByName(Constants.SHEET.MASTER); // マスターシート
const classSheet = spreadSheet.getSheetByName(Constants.SHEET.DATA); // 演習状況シート

// 配列の転置
const transpose = a => a[0].map((_, c) => a.map(r => r[c]));

// 範囲データを取得する汎用関数
const getValuesFromSheet = (sheet, startRow, startCol, numRows, numCols) => {
  return sheet.getRange(startRow, startCol, numRows, numCols).getValues();
};

// クラスの結果取得
const getResultsFromSheet = (startCol, numCols) => {
  return getValuesFromSheet(
    classSheet,
    Constants.DATA_RANGE.DATA_RECORD_START_ROW,
    startCol,
    Constants.DATA_RANGE.NUM_ROWS,
    numCols
  );
};

// クラスのメールリストの取得
const getEmailsFromSheet = () => {
  const tmpMatrix = getValuesFromSheet(
    classSheet,
    Constants.DATA_RANGE.DATA_RECORD_START_ROW,
    Constants.DATA_RANGE.EMAIL_COL,
    Constants.DATA_RANGE.NUM_ROWS,
    1
  );
  return transpose(tmpMatrix)[0]; // 1次元配列に変換して返す
};

// 正答をマスターシートから取り込み
const getValuesFromMaster = (startCol, numCols) => {
  return getValuesFromSheet(
    masterSheet,
    Constants.MASTER_RANGE.CORRECT_ANSWER_ROW,
    startCol,
    2,
    numCols
  );
};

// フォームの回答を取得するメソッド
const getResponsesFromForm = formUrl => {
  return FormApp.openByUrl(formUrl).getResponses();
};

// メールアドレスを取得するメソッド
const getEmailFromResponse = response => {
  return response.getRespondentEmail();
};

// idがマッチする問題を発見する関数
const findMatchingIndex = (
  idFromAnswer,
  correctAnswers,
  startIndex,
  responseList
) => {
  for (let j = startIndex; j < correctAnswers[1].length; j++) {
    if (idFromAnswer == correctAnswers[1][j]) {
      return j;
    }
    responseList.push('');
  }
  throw new Error(`Matching index not found for id: ${idFromAnswer}`);
};

// 正誤判定ロジック
const checkAnswer = (responseText, correctAnswers, index) => {
  // 正解
  if (responseText == correctAnswers[0][index] && responseText !== '') {
    return Constants.SYMBOLS.CORRECT;
  }
  // 不正解
  return responseText;
};

// フォームの回答を正解と比較するメソッド
const compareResponsesWithAnswers = (responses, correctAnswers) => {
  const responsesListMarked = [];

  for (const response of responses) {
    const responseList = [];

    // メール
    const email = getEmailFromResponse(response);
    responseList.push(email);

    // 設問
    const itemResponses = response.getItemResponses();
    let k = 0;

    for (const itemResponse of itemResponses) {
      let responseText = itemResponse.getResponse();
      const idFromAnswer = itemResponse.getItem().getId();

      // 配列で返された回答であれば，文字列に結合
      if (Array.isArray(responseText)) {
        responseText = responseText.join(', ');
      }

      k = findMatchingIndex(idFromAnswer, correctAnswers, k, responseList);

      const result = checkAnswer(responseText, correctAnswers, k);
      responseList.push(result);
      k++; // 次の開始位置を更新
    }
    responsesListMarked.push(responseList);
  }
  return responsesListMarked;
};

// クラスの結果リストを更新するメソッド
const updateListOfResults = (responseList, results, classEmails) => {
  for (const response of responseList) {
    const row = classEmails.indexOf(response[0]);
    const rowData = results[row];

    for (let i = 1; i < response.length; i++) {
      if (
        response[i] === rowData[i - 1] ||
        rowData[i - 1] === Constants.SYMBOLS.CORRECT
      ) {
        continue;
      } else if (response[i] !== '') {
        results[row][i - 1] = response[i];
      }
    }
  }
  return results;
};

// フォームデータを処理する関数
const processFormData = (formUrl, startCol, numCols) => {
  const responses = getResponsesFromForm(formUrl);
  const correctAnswers = getValuesFromMaster(startCol, numCols);
  const responseList = compareResponsesWithAnswers(responses, correctAnswers);
  let results = getResultsFromSheet(startCol, numCols);
  const classEmails = getEmailsFromSheet();

  results = updateListOfResults(responseList, results, classEmails);
  return results;
};

// シートに値を設定するメイン関数
const main = () => {
  const formData = masterSheet
    .getRange(
      Constants.MASTER_RANGE.FORM_DATA_START_ROW,
      Constants.MASTER_RANGE.FORM_DATA_START_COL,
      Constants.MASTER_RANGE.FORM_DATA_NUM_ROWS,
      Constants.MASTER_RANGE.FORM_DATA_NUM_COLS
    )
    .getValues();

  let startCol = Constants.DATA_RANGE.START_COL;

  for (let i = 2; i < formData[0][1] + 2; i++) {
    const questionCount = formData[i][0];
    const formUrl = formData[i][1];
    const processedData = processFormData(formUrl, startCol, questionCount);
    classSheet
      .getRange(
        Constants.DATA_RANGE.RECORD_START_ROW,
        startCol,
        Constants.DATA_RANGE.NUM_ROWS,
        questionCount
      )
      .setValues(processedData);
    startCol += questionCount;
  }
};
