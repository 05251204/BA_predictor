print(f"\n訓練データ数: {len(X_train)}")
print(f"テストデータ数: {len(X_test)}")
# --- 3. モデルの学習と評価 ---
# a4モデルに対してのみ、チューニングと評価を行う
target_col = 'A2'
y_train_target = y_train[target_col]
y_test_target = y_test[target_col]

# a2モデルに対してのみ、徹底的なチューニングを行う


print(f"\n--- '{target_col}'を予測するモデルの徹底的なチューニングを開始します ---")
print("注意：この処理には時間がかかる場合があります...")

# GridSearchCVで試すパラメータの組み合わせを定義
param_grid = {
    'n_estimators': [200, 300, 400],      # 木の数を増やす
    'max_depth': [20, 30, None],        # 木の深さを試す (Noneは制限なし)
    'min_samples_split': [2, 5],        # 分割に必要な最小サンプル数
    'min_samples_leaf': [1, 2],         # 葉にあるべき最小サンプル数
    'max_features': ['sqrt', 'log2']    # 分割に使う特徴量の数
}

# グリッドサーチを実行
# cv=3は3分割交差検証、n_jobs=-1はCPUをフル活用
grid_search = GridSearchCV(
    estimator=RandomForestClassifier(random_state=42),
    param_grid=param_grid,
    cv=3,
    n_jobs=-1,
    verbose=2 # ログを詳しく表示
)

# チューニングを実行
grid_search.fit(X_train, y_train_target)

print("\nチューニングが完了しました。")
print("見つかった最高のパラメータ:", grid_search.best_params_)
best_model = grid_search.best_estimator_

# 最高のモデルで評価
y_pred = best_model.predict(X_test)
print("\n--- チューニング後の最終評価レポート ---")
print(classification_report(y_test_target, y_pred, zero_division=0))

# 最高のモデルを保存
print(f"\n最高のモデルを 'model_{target_col}.joblib' として保存します。")
joblib.dump(best_model, f'model_{target_col}.joblib')

# (参考) a5, a6は元のランダムフォレストで学習・保存しておく
for col in ['A3', 'A4']:
    model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train[col])
    joblib.dump(model, f'model_{col}.joblib')
print("a5, a6モデルの保存が完了しました。")
