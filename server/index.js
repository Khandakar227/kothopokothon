const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');
const {User, dbConnect, isUserInGroup, addMessage} = require("./db");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(async() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);
  
  await dbConnect();

  io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if(!token) return next(new Error('Authentication error'));
        
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        const user = await User.findById(payload._id);
        
        if(!user) return next(new Error('Authentication error'));
        socket.data.user = user;
        next();
    } catch (error) {
        return next(new Error('Authentication error'));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user;
    socket.on('join-group', async ({groupId}) => {
      if(await isUserInGroup(user?._id, groupId)) {
        socket.join(groupId);
        console.log(`User ${user.name} joined group ${groupId}`);
      }
    })
    socket.on('message', async ({ groupId, message }) => {
      if(await isUserInGroup(user?._id, groupId)) {
        const chat = await addMessage({ message, userId: user?._id, username: user?.name, groupId });
        io.to(groupId).emit('message', chat);
        console.log(`${message} from ${user?._id} to group ${groupId}`);
      }
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});