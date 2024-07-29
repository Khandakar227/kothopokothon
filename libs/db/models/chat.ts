import { model, models, Schema } from "mongoose";

const ChatSchema = new Schema({
    username: { type: String, required: true },
    groupId: { type: String, required: true },
    userId: {type: String, required: true },
    message: {type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
})
export const Chat = models?.chat || model('chat', ChatSchema);
