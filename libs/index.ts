export function toDateTimeFormat(dateString:string) {
    const date = new Date(dateString);
    const d = date.getDate();
    const m = date.getMonth();
    const y = date.getFullYear();
    const hh = date.getHours();
    const mm = date.getMinutes();
    return `${d}/${m}/${y} ${hh}:${mm}`;
}

export const hashKey = async (key: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);

    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export async function encryptMessage(message:string, KEY:string) {
    // const KEY = (await hashKey(groupId + key)).slice(0, 32);
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const keyData = encoder.encode(KEY);
    const cryptoKey = await window.crypto.subtle.importKey( 'raw', keyData, 'AES-CBC', false, ['encrypt']);
    
    const iv = window.crypto.getRandomValues(new Uint8Array(16)); // Generate a random IV
    const encrypted = await window.crypto.subtle.encrypt(
        {
            name: 'AES-CBC',
            iv: iv
        },
        cryptoKey,
        data
    );
    return btoa(String.fromCharCode(...Array.from(new Uint8Array(iv)))) + ':' + btoa(String.fromCharCode(...Array.from(new Uint8Array(encrypted))));
}

export async function decryptMessage(encryptedData:string, KEY:string) {
    // const KEY = (await hashKey(groupId + key)).slice(0, 32);
    const [ivBase64, dataBase64] = encryptedData.split(':');
    const iv = new Uint8Array(atob(ivBase64).split('').map(char => char.charCodeAt(0)));
    const data = new Uint8Array(atob(dataBase64).split('').map(char => char.charCodeAt(0)));

    const encoder = new TextEncoder();
    const keyData = encoder.encode(KEY);

    const cryptoKey = await window.crypto.subtle.importKey(
        'raw', 
        keyData, 
        'AES-CBC', 
        false, 
        ['decrypt']
    );
    const decrypted = await window.crypto.subtle.decrypt(
        {
            name: 'AES-CBC',
            iv: iv
        },
        cryptoKey,
        data
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}