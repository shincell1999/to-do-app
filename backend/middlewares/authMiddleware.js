
const jwt =require('jsonwebtoken');


function authMiddleware(req, res, next) {
  // ① Authorization ヘッダを取る
  const authHeader = req.headers.authorization;

  // ② 無ければ弾く
  if (!authHeader) {
    return res.status(401).json({ message: 'No token' });
  }

  // ③ "Bearer token" から token だけ取り出す
  const token = authHeader.split(' ')[1];

  // ④ JWT検証
  try {
    const payload = jwt.verify(token, 'SECRET_KEY');

    // ⑤ 後続処理のために保存
    req.user = payload;

    // ⑥ 次へ
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authMiddleware;