
const authMiddleware = require('./middlewares/authMiddleware');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const express = require('express');

const app  = express();

app.use(express.json());

app.get('/todos', authMiddleware, (req, res) => {
  // authMiddleware が先に走っている
  
  // req.user は authMiddleware で入れた
  res.json({
    message: 'Authorized',
    userId: req.user.userId
  });
  console.log(req.user);
});

app.post('/login',async(req,res) =>{

  // 1. email, password を受け取る
  const{ email, password } = req.body;

  // 2. DBからユーザー取得（仮でOK）
  const user = {
    user_id: '1',
    email: 'test@example.com',
    password_hash: '$2b$10$m.cXkUT6.9W4f3wXZJ/v/e9uv0MZiEgDulg3/T6qvW76.nEyjOZ2G',
    role: 'user'
  };
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // 3. パスワード比較（仮でOK)
  const isMatch = await bcrypt.compare(req.body.password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // 4. JWTを返す（仮でOK）
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    'SECRET_KEY',
    { expiresIn: '1h' }
  );

  res.json({ token });


});



app.listen(3000, () => {
  console.log('Server running on port 3000');
});
