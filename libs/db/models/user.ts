import { model, models, Schema } from 'mongoose';

export interface IUser {
    name: string,
    password: string,
    role: string,
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'user' },
});

const User = models?.user || model('user', UserSchema);

export default User;