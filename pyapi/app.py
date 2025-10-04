import os
import joblib
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
import traceback # エラーの詳細を出力するためにインポート

# --- サーバー起動時の初期化処理 ---
app = Flask(__name__)

# グローバル変数としてモデルとデータを保持
char_pipelines = None
character_data_dict = None

def load_models_and_data():
    """サーバー起動時にモデルとCSVデータを一度だけ読み込む関数"""
    global char_pipelines, character_data_dict
    # flush=True を追加して、ログが即座に出力されるようにする
    print("--- サーバー初期化開始 ---", flush=True)

    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        char_pipelines = {
            'A2': joblib.load(os.path.join(base_dir, 'pipeline_A2.joblib')),
            'A3': joblib.load(os.path.join(base_dir, 'pipeline_A3.joblib')),
            'A4': joblib.load(os.path.join(base_dir, 'pipeline_A4.joblib'))
        }
        print("[SUCCESS] キャラクター予測モデルの読み込みに成功しました。", flush=True)
    except FileNotFoundError:
        char_pipelines = None
        print("[ERROR] キャラクター予測モデルのファイルが見つかりませんでした。リポジトリに含まれているか確認してください。", flush=True)

    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        df = pd.read_csv(os.path.join(base_dir, 'stu.csv'))
        print("[SUCCESS] 'stu.csv'の読み込みに成功しました。", flush=True)

        character_data_dict = {}
        col = [4, 8, 9]
        for i in range(len(df)):
            stats_list = []
            for j in col:
                stats_list.append(df.iat[i, j])
            character_data_dict[df.iat[i, 0]] = stats_list
        print("[SUCCESS] CSVデータの前処理が完了しました。", flush=True)

    except FileNotFoundError:
        character_data_dict = None
        print("[ERROR] 'stu.csv'が見つかりませんでした。リポジトリに含まれているか確認してください。", flush=True)

    print("--- サーバー初期化完了 ---", flush=True)


load_models_and_data()

# --- APIエンドポイントの定義 ---
@app.route('/')
def index():
    # サーバーが生きているか確認するための簡単なエンドポイント
    return "API server is running."

@app.route('/predict/characters', methods=['POST'])
def predict_characters():
    print("\n--- [/predict/characters] リクエスト受信 ---", flush=True)

    if not char_pipelines or not character_data_dict:
        error_msg = "サーバー側のモデルまたはデータがロードされていません。デプロイ時のログを確認してください。"
        print(f"[ERROR] {error_msg}", flush=True)
        return jsonify({'error': error_msg}), 500

    try:
        data = request.get_json()
        if not data:
            print("[ERROR] リクエストボディが空か、JSON形式ではありません。", flush=True)
            return jsonify({'error': 'リクエストボディが空か、JSON形式ではありません。'}), 400
        print(f"受信データ: {data}", flush=True)

        # (以下、予測ロジックは変更なし)
        input_df = pd.DataFrame([data])
        real_df = pd.DataFrame()
        numA1 = input_df.iat[0, 0]
        numSP = input_df.iat[0, 1]
        numSP1 = input_df.iat[0, 2]

        real_df['A1'] = [numA1]
        real_df['SP'] = [numSP]
        real_df['SP.1'] = [numSP1]
        real_df['A1_range'] = [character_data_dict[numA1][0]]
        real_df['SP.1_atc'] = [character_data_dict[numSP1][1]]
        real_df['A1_atc'] = [character_data_dict[numA1][1]]
        real_df['SP_atc'] = [character_data_dict[numSP][1]]
        real_df['A1_def'] = [character_data_dict[numA1][2]]

        final_predictions = {}
        for name, pipeline in char_pipelines.items():
            probabilities = pipeline.predict_proba(real_df)[0]
            class_names = pipeline.classes_
            results = sorted(zip(class_names, probabilities), key=lambda x: x[1], reverse=True)
            top_3 = []
            for class_name, proba in results[:3]:
                top_3.append({'name': class_name, 'probability': f'{proba * 100:.2f}'})
            final_predictions[name] = top_3
        
        return jsonify({'prediction': final_predictions})

    except KeyError as e:
        error_msg = f'入力されたキャラクター名 "{e}" は有効ではありません。'
        print(f"[ERROR] {error_msg}", flush=True)
        print(traceback.format_exc(), flush=True)
        return jsonify({'error': error_msg}), 400
    except Exception as e:
        error_msg = '予測中にサーバー側でエラーが発生しました。'
        print(f"[ERROR] {error_msg}: {e}", flush=True)
        print(traceback.format_exc(), flush=True)
        return jsonify({'error': error_msg}), 500

# --- サーバーの起動 (ローカルでの開発用) ---
if __name__ == '__main__':
    # このブロックは `python app.py` と実行した時だけ使われる
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=True)