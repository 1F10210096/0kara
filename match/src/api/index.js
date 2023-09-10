const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// MongoDBへの接続設定
const MONGO_URI = 'mongodb+srv://koki:koki1218@atlascluster.xopoj3o.mongodb.net/'; // あなたのMongoDB URIに置き換えてください
try {
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB', err);
});

// モデルの定義
const User = mongoose.model('User', {
  username: String,
  password: String
});

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());

app.post('/page_a', (req, res) => {
  const { username, password } = req.body;

  // データベースに保存
  const user = new User({ username, password });
  user.save()
  .then(savedUser => {
      res.json({ success: true, message: 'Logged in successfully!', userId: savedUser._id });
      console.log(savedUser);
  })
  .catch(err => {
      res.json({ success: false, message: 'Error saving user!' });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
}
catch (err) {
    console.log(err);
}