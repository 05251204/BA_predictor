require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const fs = require('fs');
const path = require('path');
// Renderが提供するポート、なければ3000番を使う
const PORT = process.env.PORT || 3000; 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// --- APIエンドポイント定義 ---
app.post('/api/predict-characters', async (req, res) => {
    const pythonApiUrl = process.env.PYTHON_CHAR_API_URL;
    if (!pythonApiUrl) {
        return res.status(500).json({ error: 'キャラクター予測APIのURLが設定されていません。' });
    }
    try {
        const response = await fetch(pythonApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('キャラクター予測API連携エラー:', error);
        res.status(500).json({ error: 'キャラクター予測APIとの連携に失敗しました。' });
    }
});


// --- サーバー起動 ---
app.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で起動しました`);
});