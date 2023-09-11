const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// MongoDBへの接続設定
const MONGO_URI = 'mongodb+srv://koki:koki1218@atlascluster.xopoj3o.mongodb.net/'; // あなたのMongoDB URIに置き換えてください
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
console.log("dwdw")

// Enable CORS for all routes
app.use(cors());
try {
//test
app.get('/getUsers', async (req, res) => {
  try {
    const users = await User.find();
    console.log("dawdwd")
    console.log(users)
    console.log("dawdwd")
    res.json({ success: true, users });
  } catch (err) {
    res.json({ success: false, message: 'Error fetching users!' });
  }
});
} catch (err) {
  console.log(err);
}

//test

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.post('/page_a', async (req, res) => {
  const { username, password } = req.body;

  try {
      const foundUser = await User.findOne({ username, password });
      if (foundUser) {
          res.json({ success: true, message: 'Logged in successfully!', userId: foundUser._id });
      } else {
          res.json({ success: false, message: 'Invalid username or password!' });
      }
  } catch (err) {
      res.json({ success: false, message: 'Error querying the database!' });
  }
});
app.post('/subsc', (req, res) => {
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

try {

//待機中の接続者のモデルを作成
const WaitingUserSchema = new mongoose.Schema({
  userId: String,
  timestamp: { type: Date, default: Date.now }  // 接続した時刻
});

//待機リストにユーザーを追加するエンドポイント:
app.post('/waiting', async (req, res) => {
  const { userId } = req.body;

  // userIdが提供されていない、またはすでに待機リストに存在する場合はエラーを返す
  const exists = await WaitingUser.findOne({ userId });
  if (!userId || exists) {
    return res.status(400).json({ success: false, message: 'Invalid userId or user already in waiting list' });
  }

  const user = new WaitingUser({ userId });
  user.save()
    .then(savedUser => {
      console.log(user)
      res.json({ success: true, message: 'User added to waiting list', waitingUserId: savedUser._id });
    })
    .catch(err => {
      res.json({ success: false, message: 'Error saving waiting user!' });
    });
});

//待機中の接続者リストを取得するエンドポイント:
app.get('/getWaitingUsers', async (req, res) => {
  try {
    const users = await WaitingUser.find();
    res.json({ success: true, users });
  } catch (err) {
    res.json({ success: false, message: 'Error fetching waiting users!' });
  }
});


//マッチングロジック
app.get('/matchUser/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const users = await WaitingUser.find({ userId: { $ne: userId } });

    if (!users.length) {
      return res.json({ success: false, message: 'No users available for matching.' });
    }

    const matchedUser = users[0];  // シンプルな例では、最初の待機ユーザーをマッチさせます。
    console.log(matchedUser,"matchedUser")

    // マッチしたら、待機リストから2人のユーザーを削除
    await WaitingUser.deleteOne({ userId: matchedUser.userId });
    await WaitingUser.deleteOne({ userId });


    res.json({ success: true, match: matchedUser.userId });
  } catch (err) {
    res.json({ success: false, message: 'Error matching user!' });
  }
});

const WaitingUser = mongoose.model('WaitingUser', WaitingUserSchema);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
} catch (err) {
  console.log(err);
}

