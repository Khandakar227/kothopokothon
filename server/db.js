const { model, models, Schema, connect,  } = require('mongoose');

const UserSchema = new Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'user' },
});

const GroupSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    createdBy: {type: String, required: true},
    uid: { type: String, required: true },
    users: [{type: String, default: []}],
    createdAt: { type: Date, default: Date.now() },
})

const ChatSchema = new Schema({
    username: { type: String, required: true },
    groupId: { type: String, required: true },
    userId: {type: String, required: true },
    message: {type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
})

const User = models?.user || model('user', UserSchema);
const Group = models?.group || model('group', GroupSchema);
const Chat = models?.chat || model('chat', ChatSchema);


async function dbConnect() {
    if (!process.env.MONGODB_URI) {
        throw new Error('Add Mongo URI to .env.local')
    }
    await connect(process.env.MONGODB_URI, {
        dbName: process.env.DBNAME,
    });
}

const isUserInGroup = async (userId, groupId) => {
    const joinedGroup = await Group.findOne({ _id: groupId, users:userId});
    const createdGroup = await Group.findOne({ _id: groupId, createdBy: userId });
    if(!joinedGroup && !createdGroup) return false;
    return true
}

const addMessage = async (data) => {
    const chat = await Chat.create(data);
    return chat;
}

module.exports = { User, dbConnect, isUserInGroup, addMessage };