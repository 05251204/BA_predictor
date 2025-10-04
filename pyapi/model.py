import numpy as np
import pandas as pd
import lightgbm as lgb
import joblib
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier 
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, ConfusionMatrixDisplay
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

# --- 1. データの読み込み ---
try:
    df1 = pd.read_csv('res1.csv')
    df2 = pd.read_csv('res2.csv')
    df = pd.read_csv('stu.csv')
    print("CSVファイルの読み込みに成功しました。")
except FileNotFoundError:
    print("エラー: 'res.csv'が見つかりません。作業フォルダ内に配置してください。")
    exit()

#Aは攻撃側、Dは防御側のデータ
X1A = df1[['A1', 'SP', 'SP.1']]
y1A = df1[['A2', 'A3', 'A4']]
X2A = df2[['A1', 'SP', 'SP.1']]
y2A = df2[['A2', 'A3', 'A4']]

X1D = df1[['D1', 'SP.2', 'SP.3']]
y1D = df1[['D2', 'D3', 'D4']]
X2D = df2[['D1', 'SP.2', 'SP.3']]
y2D = df2[['D2', 'D3', 'D4']]

X1D=X1D.rename(columns={'D1': 'A1', 'SP.2': 'SP' , 'SP.3':'SP.1'})
y1D=y1D.rename(columns={'D2': 'A2', 'D3': 'A3' , 'D4':'A4'})
X2D=X2D.rename(columns={'D1': 'A1', 'SP.2': 'SP' , 'SP.3':'SP.1'})
y2D=y2D.rename(columns={'D2': 'A2', 'D3': 'A3' , 'D4':'A4'})

# --- 2. データの前処理と分割 ---
# 入力(X)と出力(y)にデータを分割、Aは重複が多いので不使用
X = pd.concat([X1D,X2D])
y = pd.concat([y1D,y2D])
# カテゴリカルデータを数値に変換するためのエンコーダー
encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
# 全データを使ってエンコーダーを学習させる（これはテストデータに含まれる未知のカテゴリに対応するため）
encoder.fit(X)
# エンコーダーを保存
joblib.dump(encoder, 'character_encoder.joblib')
print("\nエンコーダーを 'character_encoder.joblib' として保存しました。")
# データを数値に変換
X_encoded = encoder.transform(X)

#dfはキャラクターデータのリスト型、0=名前 1=画像 2=特殊挙動 3=遮蔽 4=射程 5=タイプ 6=ポジション 7=役割 8=攻撃 9=防御
dict={}
col=[4,8,9]
for i in range(0,225):
    list=[]
    for j in  col:
        list.append(df.iat[i,j])
    dict[df.iat[i,0]]=list

lrange=[]
latcA1=[]
latcSP=[]
latcSP1=[]
ldef=[]
for i in range(0,len(X)):
    lrange.append(dict[X.iat[i,0]][0])
    latcA1.append(dict[X.iat[i,0]][1])
    ldef.append(dict[X.iat[i,0]][2])
    latcSP.append(dict[X.iat[i,1]][1])
    latcSP1.append(dict[X.iat[i,2]][1])
#射程、防御攻撃型を追加       
X['A1_atc']=latcA1
X['A1_def']=ldef
X['A1_range']=lrange
X['SP_atc']=latcSP
X['SP.1_atc']=latcSP1

# どのカラムが数値で、どのカラムが文字（カテゴリ）かを定義
numerical_features = ['A1_range']
categorical_features = ['A1', 'SP', 'SP.1', 
                        'A1_atc', 'A1_def', 
                        'SP_atc', 'SP.1_atc']
# ColumnTransformerで、カラムごとに異なる前処理を定義
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_features), # 数値データはスケールを揃える
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features) # 文字データはOne-Hotエンコード
    ])

# 4. データを訓練用とテスト用に分割
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 5. 各ターゲット(A2,A3,A4)のモデルを学習・評価・保存
for target_col in ['A2', 'A3', 'A4']:
    print(f"\n--- '{target_col}'を予測するモデルを学習中 ---")
    
    # 前処理とモデルを連結した「パイプライン」を作成
    model_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1))
    ])

    # パイプライン全体を訓練データで学習
    model_pipeline.fit(X_train, y_train[target_col])
    
    # パイプラインを使ってテストデータで評価
    y_test_target = y_test[target_col]
    y_pred = model_pipeline.predict(X_test)
    print("詳細評価レポート:")
    print(classification_report(y_test_target, y_pred, zero_division=0))

    # 学習済みの「パイプライン全体」をファイルに保存
    pipeline_filename = f'pipeline_{target_col}.joblib'
    joblib.dump(model_pipeline, pipeline_filename)
    print(f"パイプラインを '{pipeline_filename}' として保存しました。")

print("\nすべてのモデルパイプラインの作成と保存が完了しました。")