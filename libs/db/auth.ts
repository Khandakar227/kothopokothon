import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import jwt from 'jsonwebtoken';
import User, { IUser } from "./models/user";

const LOGIN_DURATION = '7d'

export function hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = scryptSync(password, salt, 64).toString("hex");

    return `${salt}:${hashedPassword}`;
}

export function checkPasswordMatch(password: string, hashedPassword: string) {
    const [salt, key] = hashedPassword.split(":");
    const hashedBuffer = scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, "hex");
    const match = timingSafeEqual(hashedBuffer, keyBuffer);

    if (match) return true;
    return false;
}

export async function signup(name: string, password: string) {
    const user = await User.findOne({ name });
    if(user) throw new Error('User with the name already exist. Try a different name');
    const hashedPassword = hashPassword(password);
    await User.create({name, password:hashedPassword});

}

export async function login(name: string, password: string) {
    const users = await User.find({ name });
    if (!users.length) throw Error("Invalid name or password.");

    return new Promise((resolve, reject) => {
        users.forEach(user => {
            if (checkPasswordMatch(password, user.password)) {
                const userInfo = {
                    name: user.name,
                    _id: user._id,
                    createdAt: new Date()
                };
                const token = jwt.sign(userInfo, process.env.JWT_SECRET_KEY as string, {
                    expiresIn: LOGIN_DURATION,
                });
                resolve({ token, userInfo });
            }
        })
        reject(new Error("Invalid name or password."));
    });
}

export const getUser = async (token: string) => {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    const user = await User.findById((payload as any)._id).select('-password');
    return user;
}