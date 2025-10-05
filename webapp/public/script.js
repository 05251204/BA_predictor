//入力データのロード
const charForm = document.getElementById('character-form');

charForm.addEventListener('submit', async (event) => {
    //リロードを防止
    event.preventDefault();

    const resultDiv = document.getElementById('character-result');
    resultDiv.textContent = '予測中...';
    //入力はD1, SP1, SP2だが、pythonに渡すのはA1,SP,SP1
    const inputData = {
        A1: document.getElementById('char-D1').value,
        SP: document.getElementById('char-SP1').value,
        SP1: document.getElementById('char-SP2').value
    };

  try {
        const response = await fetch('https://ba-predictor-api.onrender.com/predict/characters', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputData)
        });

        const data = await response.json();

        if (data.prediction) {
            let html = '<p><strong>予測結果:</strong></p>';
            // (debug)console.log("Pythonから受け取った予測オブジェクト:", data.prediction);
            // D2,D3,D4のそれぞれについてループ処理
            for (const targetName of ['A2', 'A3', 'A4']) {
                const predictions = data.prediction[targetName];
                if (predictions) {
                    html += `<h4>D${targetName.toUpperCase()[1]}の予測</h4><ul>`;
                    
                    // 上位3位の予測結果をリスト表示
                    predictions.forEach((pred, index) => {
                        html += `<li class="d-flex justify-content-between align-items-center"><span class="label">${index + 1}位: ${pred.name} </span><span class="prob">(確率: ${pred.probability}%)</span></li>`;
                    });
                    html += `</ul>`;
                }
            }
            resultDiv.innerHTML = html; // 生成したHTMLを画面に反映    
        } else {
            resultDiv.textContent = `エラー: ${data.error || '不明なエラー'}`;
        }
    } catch (error) {
        alert('エラーが発生しました:\n\n' + error.toString());
        resultDiv.textContent = 'エラーが発生しました。詳細はポップアップを確認してください。';
    }
});




var stu=["アイリ（バンド）","アオバ","アカネ","アカリ","アコ（ドレス）","アズサ","アズサ（水着）","アスナ","アスナ（バニーガール）","アスナ（制服）","アツコ","アリス","アリス（メイド）","アル","アル（ドレス）","アル（正月）","イオリ","イオリ（水着）","イズナ","イズナ（水着）","イズミ","イズミ（水着）","イチカ","イブキ","ウイ","ウイ（水着）","ウタハ（応援団）","ウミカ","エイミ","カズサ","カズサ（バンド）","カスミ","カホ","カヨコ","カヨコ（ドレス）","カヨコ（正月）","カリン（バニーガール）","カンナ（水着）","キキョウ","キララ","キリノ","ココナ","コタマ（キャンプ）","コトリ","コトリ（応援団）","コハル","コハル（水着）","コユキ","サオリ","サオリ（ドレス）","サオリ（水着）","サキ（水着）","サクラコ","サクラコ（アイドル）","シグレ","ジュリ（アルバイト）","シュン","シュン（幼女）","ジュンコ","ジュンコ（正月）","シロコ","シロコ（ライディング）","シロコ＊テラー","スズミ","スミレ","セイア","セナ（私服）","セリカ","セリナ（クリスマス）","チアキ","チェリノ","チセ","チセ（水着）","チナツ（温泉）","ツクヨ","ツバキ","ツルギ","ツルギ（水着）","トキ","トキ（バニーガール）","トモエ","ナグサ","ナツ","ネル","ネル（バニーガール）","ネル（制服）","ノア","ノア（パジャマ）","ノゾミ","ノノミ","ノノミ（水着）","ハスミ","ハスミ（体操服）","ハナコ（水着）","ハルカ","ハルナ","ハルナ（正月）","ハレ（キャンプ）","ヒカリ","ヒナ","ヒナ（ドレス）","ヒナ（水着）","ヒナタ","ヒビキ（応援団）","ヒフミ","ヒヨリ（水着）","フィーナ","フブキ","ホシノ","ホシノ（攻撃）","ホシノ（水着）","ホシノ（防御）","ホシノ（臨戦）","マキ","マリー（アイドル）","マリー（体操服）","マリナ","マリナ（チーパオ）","ミカ","ミサキ","ミチル","ミドリ","ミドリ（メイド）","ミナ","ミネ","ミネ（アイドル）","ミモリ","ミヤコ","ミヤコ（水着）","ミユ","ムツキ","ムツキ（正月）","メグ","メル","モエ（水着）","モミジ","モモイ","モモイ（メイド）","ユウカ","ユウカ（パジャマ）","ユウカ（体操服）","ユカリ","ユズ","ヨシミ（バンド）","ルミ","レイ","レイサ","レイジョ","レンゲ","ワカモ","ワカモ（水着）","御坂美琴","食蜂操祈","アイリ","アカネ（バニーガール）","アカリ（正月）","アコ","アツコ（水着）","アヤネ","アヤネ（水着）","イズミ（正月）","イロハ","ウタハ","エイミ（水着）","カエデ","カリン","カリン（制服）","カンナ","キサキ","キリノ（水着）","コタマ","サキ","サツキ","サヤ","サヤ（私服）","シグレ（温泉）","シズコ","シズコ（水着）","シミコ","ジュリ","シロコ（水着）","スミレ（アルバイト）","セナ","セリカ（水着）","セリカ（正月）","セリナ","チェリノ（温泉）","チナツ","チヒロ","ツバキ（ガイド）","トモエ（チーパオ）","ナギサ","ニヤ","ノドカ","ノドカ（温泉）","ハナエ","ハナエ（クリスマス）","ハナコ","ハルカ（正月）","ハルナ（体操服）","ハレ","ヒナタ（水着）","ヒビキ","ヒフミ（水着）","ヒマリ","ヒヨリ","フィーナ（ガイド）","フウカ","フウカ（正月）","フブキ（水着）","マキ（キャンプ）","マコト","マシロ","マシロ（水着）","マリー","ミノリ","ミモリ（水着）","ミユ（水着）","モエ","ユズ（メイド）","ヨシミ","リオ","佐天涙子","初音ミク","ナツ（バンド）",];

const autoCompleteD1 = new autoComplete({
  query: (query) => {
    // ひらがなをカタカナに変換
    return query.replace(/[\u3041-\u3096]/g, (match) => {
      return String.fromCharCode(match.charCodeAt(0) + 0x60);
    });
  },
  data: {
    src: stu,
    caches: true,
    },
    filter: (list) => {
      // Filter duplicates
      // incase of multiple data keys usage
      const filteredResults = Array.from(new Set(list.map((value) => value.match))).map((food) => {
        return list.find((value) => value.match === food);
      });

      return filteredResults;
    },
  resultsList: {
    element: (list, data) => {
      const info = document.createElement("p");
      if (data.results.length) {
        info.innerHTML = `Displaying <strong>${data.results.length}</strong> out of <strong>${data.matches.length}</strong> results`;
      } else {
        info.innerHTML = `Found <strong>${data.matches.length}</strong> matching results for <strong>"${data.query}"</strong>`;
      }
      //list.prepend(info);
    },
    noResults: true,
    maxResults: 15,
    tabSelect: true,
  },
  resultItem: {
    element: (item, data) => {
      // Modify Results Item Style
      item.style = "display: flex; justify-content: space-between;";
      // Modify Results Item Content
      item.innerHTML = `
      <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
        ${data.match}
      </span>`;
    },
    highlight: true,
  },
  events: {
    input: {
      focus() {
        if (autoCompleteD1.input.value.length) autoCompleteD1.start();
      },
      selection(event) {
        const feedback = event.detail;
        autoCompleteD1.input.blur();
        // Prepare User's Selected Value
        const selection = feedback.selection.value;
        // Render selected choice to selection div
        document.querySelector(".selection1").innerHTML = selection;
        // Replace Input value with the selected value
        autoCompleteD1.input.value = selection;
        // Console log autoComplete data feedback
        console.log(feedback);
      },
    },
  },
  selector: "#char-D1",
});


const autoCompleteSP1 = new autoComplete({
  query: (query) => {
    // ひらがなをカタカナに変換
    return query.replace(/[\u3041-\u3096]/g, (match) => {
      return String.fromCharCode(match.charCodeAt(0) + 0x60);
    });
  },
  data: {
    src: stu,
    caches: true,
    },
    filter: (list) => {
      // Filter duplicates
      // incase of multiple data keys usage
      const filteredResults = Array.from(new Set(list.map((value) => value.match))).map((food) => {
        return list.find((value) => value.match === food);
      });

      return filteredResults;
    },
  resultsList: {
    element: (list, data) => {
      const info = document.createElement("p");
      if (data.results.length) {
        info.innerHTML = `Displaying <strong>${data.results.length}</strong> out of <strong>${data.matches.length}</strong> results`;
      } else {
        info.innerHTML = `Found <strong>${data.matches.length}</strong> matching results for <strong>"${data.query}"</strong>`;
      }
      //list.prepend(info);
    },
    noResults: true,
    maxResults: 15,
    tabSelect: true,
  },
  resultItem: {
    element: (item, data) => {
      // Modify Results Item Style
      item.style = "display: flex; justify-content: space-between;";
      // Modify Results Item Content
      item.innerHTML = `
      <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
        ${data.match}
      </span>`;
    },
    highlight: true,
  },
  events: {
    input: {
      focus() {
        if (autoCompleteSP1.input.value.length) autoCompleteSP1.start();
      },
      selection(event) {
        const feedback = event.detail;
        autoCompleteSP1.input.blur();
        // Prepare User's Selected Value
        const selection = feedback.selection.value;
        // Render selected choice to selection div
        document.querySelector(".selection2").innerHTML = selection;
        // Replace Input value with the selected value
        autoCompleteSP1.input.value = selection;
        // Console log autoComplete data feedback
        console.log(feedback);
      },
    },
  },
  selector: "#char-SP1",
});

const autoCompleteSP2 = new autoComplete({
  query: (query) => {
    // ひらがなをカタカナに変換
    return query.replace(/[\u3041-\u3096]/g, (match) => {
      return String.fromCharCode(match.charCodeAt(0) + 0x60);
    });
  },
  data: {
    src: stu,
    caches: true,
    },
    filter: (list) => {
      // Filter duplicates
      // incase of multiple data keys usage
      const filteredResults = Array.from(new Set(list.map((value) => value.match))).map((food) => {
        return list.find((value) => value.match === food);
      });

      return filteredResults;
    },
  resultsList: {
    element: (list, data) => {
      const info = document.createElement("p");
      if (data.results.length) {
        info.innerHTML = `Displaying <strong>${data.results.length}</strong> out of <strong>${data.matches.length}</strong> results`;
      } else {
        info.innerHTML = `Found <strong>${data.matches.length}</strong> matching results for <strong>"${data.query}"</strong>`;
      }
      //list.prepend(info);
    },
    noResults: true,
    maxResults: 15,
    tabSelect: true,
  },
  resultItem: {
    element: (item, data) => {
      // Modify Results Item Style
      item.style = "display: flex; justify-content: space-between;";
      // Modify Results Item Content
      item.innerHTML = `
      <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
        ${data.match}
      </span>`;
    },
    highlight: true,
  },
  events: {
    input: {
      focus() {
        if (autoCompleteSP2.input.value.length) autoCompleteSP2.start();
      },
      selection(event) {
        const feedback = event.detail;
        autoCompleteSP2.input.blur();
        // Prepare User's Selected Value
        const selection = feedback.selection.value;
        // Render selected choice to selection div
        document.querySelector(".selection3").innerHTML = selection;
        // Replace Input value with the selected value
        autoCompleteSP2.input.value = selection;
        // Console log autoComplete data feedback
        console.log(feedback);
      },
    },
  },
  selector: "#char-SP2",
});