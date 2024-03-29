const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const app = express();





app.use(cors());
app.use(bodyParser.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
  }
});


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

const ProfileSchema = new mongoose.Schema({
  ok: String,
  nickname: String,
  gender: String,
  age: String, // もし年齢が数値として保存される場合は 'Number' に変更してください
  comment: String,
  photo: String // これは写真のURLやパスを保存する文字列として考えられます。もし実際にバイナリデータとして画像を保存する場合は、適切な方法を検討する必要があります。
});

const MessageSchema = new mongoose.Schema({
  message: String,
  roomId: String,
  userId: String,
  sentAt: Date,
});




const Profile = mongoose.model('Profile', ProfileSchema);


//いいねリストのモデルを作成
const LikedProfileSchema = new mongoose.Schema({
  myId: String,  // 自分のIDを保存するためのフィールド
  likeId: [String]
});

const LikedProfile = mongoose.model('LikedProfile', LikedProfileSchema);
app.post('/likeUser', async (req, res) => {
  try {
    console.log("poppopoppo");
    const { userId, myId } = req.body;

    if (!myId) {
      return res.status(400).json({ success: false, message: 'myId is required.' });
    }
    
    let likedProfileEntry = await LikedProfile.findOne({ myId: myId });

    if (!likedProfileEntry) {
      likedProfileEntry = new LikedProfile({ myId: myId, likeId: [userId] });
    } else {
      likedProfileEntry.likeId.push(userId);  // 'likeId' as per your schema
    }

    await likedProfileEntry.save();

    // userIdとokが一致するProfileを検索
    const matchedProfile = await Profile.findOne({ ok: userId });
    
    // Send updated like to the frontend
    io.emit('newLikeAdded', { myId: myId, userId: userId, profile: matchedProfile }); // sending the data to all clients

    res.json({ success: true, message: 'User liked successfully.', profile: matchedProfile });
    
  } catch (err) {
    console.error('Error liking user:', err);
    res.status(500).json({ success: false, message: 'Error liking user!' });
  }
});

app.get('/getLikedProfiles', async (req, res) => {
  console.log("Entered /getLikedProfiles endpoint");  // ← 既に追加しています

  try {
    const { myId } = req.query;

    let likedProfiles;
    if (myId) {
      const likedProfileEntry = await LikedProfile.findOne({ myId: myId });
      if (!likedProfileEntry) {
        return res.status(404).json({ success: false, message: 'No liked profiles found for this user.' });
      }
      likedProfiles = [likedProfileEntry.likeId];
    } else {
      likedProfiles = await LikedProfile.find({});
    }

    res.json({ success: true, likedProfiles: likedProfiles });

  } catch (err) {
    console.error('Error fetching liked profiles:', err);
    res.status(500).json({ success: false, message: 'Error fetching liked profiles!' });
  }
});

// Enable CORS for all routes
app.use(cors());
try {
//test
app.get('/getUsers', async (req, res) => {
  try {
    const users = await User.find();
    console.log(users)
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

  console.log("Entered /waiting endpoint");  // ← 既に追加しています

  const { userId } = req.body;
  console.log(userId, "userId")

  // userIdが提供されていない、またはすでに待機リストに存在する場合はエラーを返す
  const exists = await WaitingUser.findOne({ userId });
  console.log(exists)
  if (!userId || exists) {
    return res.status(400).json({ success: false, message: 'Invalid userId or user already in waiting list' });
  }


  const user = new WaitingUser({ userId });
  user.save()
  .then(savedUser => {
    console.log("3ddd");
    console.log(savedUser);  // もし savedUser の情報をログとして出力したい場合
    res.json({ success: true, message: 'User added to waiting list', waitingUserId: savedUser._id });
  })
  .catch(err => {
    console.error(err); // 保存時のエラーをログに出力
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

let clients = {};

app.get('/events', (req, res) => {
    const userId = req.query.userId;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 新しいクライアントを追加
    clients[userId] = res;

    // クライアントが切断した場合、そのクライアントを削除する
    req.on('close', () => {
        delete clients[userId];
    });
});

app.get('/matchUser/:userId', async (req, res) => {
  try {
    // 必要なヘッダーの設定
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const { userId } = req.params;
    const users = await WaitingUser.find({ userId: { $ne: userId } });

    if (!users.length) {
      res.write(`data: ${JSON.stringify({ success: false, message: 'No users available for matching.' })}\n\n`);
      return res.end();
    }

    const matchedUser = users[0];
    console.log(matchedUser, "matchedUser")

    // ランダムな数字を生成
    const randomNum = Math.floor(Math.random() * 10000); // 0から9999までの整数
    
    // クライアントにデータを送信する関数
    const sendData = (client, randomNum, matchedUserId) => {
      console.log("Sendieeee:", client);
      const data = {
        roomNumber: randomNum,
        matchedUserId: matchedUserId
      };
      console.log("Sending data:", data);
      client.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    if (clients[matchedUser.userId]) {
      sendData(clients[matchedUser.userId], randomNum, userId);
    }

    if (clients[userId]) {
      sendData(clients[userId], randomNum, matchedUser.userId);
    }

    console.log(matchedUser.userId, "matchedUser.userId")
    // マッチしたら、待機リストから2人のユーザーを削除
    await WaitingUser.deleteOne({ userId: matchedUser.userId });
    await WaitingUser.deleteOne({ userId });



// クライアントにデータを送信する関数
const sendData = (client, randomNum, matchedUserId) => {
  const data = {
      roomNumber: randomNum,
      matchedUserId: matchedUserId
  };
  client.write(`data: ${JSON.stringify(data)}\n\n`);
};

if (clients[matchedUser.userId]) {
  // matchedUserにはuserIdのユーザーがマッチしたという情報を送信
  sendData(clients[matchedUser.userId], randomNum, userId);
}

if (clients[userId]) {
  // userIdのユーザーにはmatchedUser.userIdとマッチしたという情報を送信
  sendData(clients[userId], randomNum, matchedUser.userId);
}
  

  res.json({ success: true, match: matchedUser.userId, randomNum: randomNum });


  } catch (err) {
    console.error(err);
    res.write(`data: ${JSON.stringify({ success: false, message: 'Error matching user!' })}\n\n`);
    return res.end();
  }
});





try {// Configure multer storage
  const storage = multer.memoryStorage();  // This stores the file in memory. You can also use `multer.diskStorage()` to store on disk
  const upload = multer({ storage: storage });
  
  app.post('/api/profile', upload.single('photo'), (req, res) => {
    const file = req.file;
    const otherData = req.body;
  
    // TODO: Save the file and otherData to the database
    // If using Firebase Storage, save the file there. For other databases like MongoDB, consider storing the file in a GridFS bucket.
  
    res.json({ success: true });
  });
} catch (err) {
  console.log(err);
}







const WaitingUser = mongoose.model('WaitingUser', WaitingUserSchema);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
} catch (err) {
  console.log(err);
}

try{
app.post('/getUserProfile', async (req, res) => {
  try {
    const { userId } = req.body;
    const profile = await Profile.findOne({ ok: userId }); // ここでokフィールドとuserIdを照合
    if (profile) {
      res.json({ success: true, profile });
    } else {
      res.json({ success: false, message: 'No profile found for the given userId' });
    }
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ success: false, message: 'Error fetching profile!' });
  }
});
} catch (err) {
  console.log(err);
}


// const checkFirebaseToken = async (req, res, next) => {
//   const headerToken = req.headers.authorization;
//   if (!headerToken) {
//     return res.status(401).send({ message: 'No token, authorization denied' });
//   }

//   try {
//     const decodedToken = await admin.auth().verifyIdToken(headerToken);
//     req.user = decodedToken;
//     next();
//   } catch (err) {
//     res.status(401).send({ message: 'Invalid token, authorization denied' });
//   }
// };
  
const roomAndIdsSchema = new mongoose.Schema({
  roomId: String,
  idsArray: [String],
});

const RoomAndIds = mongoose.model('RoomAndIds', roomAndIdsSchema);app.post('/sendIds', async (req, res) => {
  try {
    const { roomId, user, opponent } = req.body;

    if (!roomId || !user || !opponent) {
      return res.status(400).json({ success: false, message: 'roomId, user, and opponent are required.' });
    }

    // 既存のroomIdをチェック
    const existingRoom = await RoomAndIds.findOne({
      idsArray: { $all: [user, opponent] }
    });

    if (existingRoom) {
      return res.json({ success: true, roomId: existingRoom.roomId });
    }

    // 新しいroomIdをデータベースに保存
    const roomAndIdsEntry = new RoomAndIds({ roomId, idsArray: [user, opponent] });
    await roomAndIdsEntry.save();

    res.json({ success: true, roomId: roomId, message: 'Room and IDs saved successfully.' });

  } catch (err) {
    console.error('Error saving room and IDs:', err);
    res.status(500).json({ success: false, message: 'Error saving room and IDs!' });
  }
});

const Message = mongoose.model('Message', MessageSchema);

app.post('/Msg', async (req, res) => {
  try {
    const { message, roomId, userId, sentAt } = req.body;
    console.log("message", roomId)

    const newMessage = new Message({
      message,
      roomId,
      userId,
      sentAt: new Date(sentAt)
    });

    const savedMessage = await newMessage.save();

    res.status(201).json({ success: true, message: 'Message sent successfully!', data: savedMessage });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

async function handleRoomClick(roomId) {
  try {
    const response = await fetch('http://localhost:5000/fetchRoomMessages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomId }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Fetched Room Data:', data);

    // TODO: 必要に応じてフェッチしたデータを状態やUIに反映させる

  } catch (error) {
    console.error('Error:', error);
  }
}
const users = {};  // ユーザーIDとソケットIDの関連付けを保持するオブジェクト

io.on('connection', (socket) => {
    console.log('User connected');

    // ユーザーIDをソケットIDと関連付ける
    socket.on('registerUser', (userId) => {
        users[userId] = socket.id;
    });

    // 特定のユーザーIDを持つクライアントにメッセージを送信する
    socket.on('sendMessage', (data) => {
      console.log("tryf")
        const targetSocketId = users[data.targetUserId];
        console.log("1")
        console.log(targetSocketId)
        if (targetSocketId) {
          console.log("2")
            io.to(targetSocketId).emit('receiveMessage', data.message);
            console.log("3")
        }
    });

    socket.on('disconnect', () => {
        // 切断時にユーザーとソケットの関連付けを削除
        const userIdToDelete = Object.keys(users).find(userId => users[userId] === socket.id);
        if (userIdToDelete) {
            delete users[userIdToDelete];
        }
        console.log('User disconnected');
    });

    // Listen for a new like
    socket.on('newLikeAdded', (data) => {
        console.log(`User with ID ${data.myId} liked user with ID ${data.userId}`);
        // You can add further processing here if needed
    });

    socket.on('message', (payload) => {
      console.log("uyuy")
    
      const data = JSON.parse(payload);
      const message = data.message;
      const name = data.name;
      console.log("uyuy")
    
      console.log(`${name} says: ${message}`);
      // 他のクライアントにメッセージをブロードキャストするなどの処理...
    });
});


app.post('/fetchRoomMessages', async (req, res) => {
  const { roomId } = req.body;

  try {
    // この部分ではデータベースからルームIDに関連する情報をフェッチする。
    // 例: const messages = await db.fetchMessagesByRoomId(roomId);

    // フェッチしたデータをレスポンスとして送り返す。
    res.json({
      success: true,
      messages: Message,  // 仮のデータ
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

app.post('/fetchMessages', async (req, res) => {
  try {
    const { roomId } = req.body;

    // roomIdに一致するすべてのメッセージを検索します
    const messages = await Message.find({ roomId });

    res.status(200).json({ success: true, data: messages });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

