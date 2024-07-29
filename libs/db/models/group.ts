import mongoose, { model, models, Schema } from "mongoose";

const GroupSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    uid: { type: String, required: true },
    createdBy: {type: String, required: true},
    users: [{type: mongoose.Types.ObjectId, ref: "user", default: []}],
    createdAt: { type: Date, default: Date.now() },
})

export const Group = models?.group || model('group', GroupSchema);
