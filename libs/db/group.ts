import { checkPasswordMatch, hashPassword } from "./auth";
import { Group } from "./models/group";
import User from "./models/user";

export async function createGroup(data: {name:string, username:string, password: string, createdBy: string}) {
    console.log(data)
    const group = await Group.findOne({name: data.name, createdBy: data.createdBy});
    if(group) throw new Error("You created a group of this name is already");
    const newGroup = await Group.create({
        ...data,
        password:hashPassword(data.password),
        uid: `${data.name}@${data.username}`,
    });

    return newGroup;
}

export async function getCreatedGroups(userId:string) {
    const groups = await Group.find({createdBy:userId}).select('-password');
    return groups;
}

export async function getGroupInfo(id:string) {
    const group = await Group.findById(id).select('-password');
    if(!group) throw new Error("Group does not exist");
    return {_id: group._id, name: group.name, createdAt:group.createdAt, uid: group.uid}
}


export const isUserInGroup = async (userId:string, groupId:string) => {
    const joinedGroup = await Group.findOne({ _id: groupId, users:userId});
    const createdGroup = await Group.findOne({ _id: groupId, createdBy: userId });
    if(!joinedGroup && !createdGroup) return false;
    return true
}

export const joinGroup = async (userId:string, uid:string, password:string) => {
    const group = await Group.findOne({ uid }).select("-users");
    if(!checkPasswordMatch(password, group.password)) throw new Error("Password does not match");
    const checkGroupHasUser = await Group.findOne({ uid, users: userId });
    const checkGroupAdmin = await Group.findOne({ uid, createdBy: userId });
    if(checkGroupHasUser || checkGroupAdmin) throw new Error("Already joined the group");

    await Group.findOneAndUpdate({ uid }, { $push: { users: userId }});
    return {name: group.name, uid: group.uid, _id: group._id, createdAt: group.createdAt }
}

export const getJoinedGroups = async (userId:string) => {
    const groups = await Group.find({users:userId}).select('-password');
    return groups;
}