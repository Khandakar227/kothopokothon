import { isUserInGroup } from "./group"
import { Chat } from "./models/chat";

export const getGroupChats = async (userId:string, groupId: string) => {
    if(!(await isUserInGroup(userId, groupId))) throw new Error("You are not a member of the group");
    const chats = await Chat.find({groupId});
    return chats;

}