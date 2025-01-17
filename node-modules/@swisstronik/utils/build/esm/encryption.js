import { hmac } from '@noble/hashes/hmac';
import { sha256 } from '@noble/hashes/sha256';
import * as nacl from 'tweetnacl';
import * as deoxysii from '@oasisprotocol/deoxysii';
import { randomBytes } from 'tweetnacl';
import { stringToU8a, u8aConcat } from './utils.js';
export const TX_KEY_PREFIX = 'IOEncryptionKeyV1';
export const USER_KEY_PREFIX = 'UserEncryptionKeyV1';
export function deriveEncryptionKey(privateKey, salt) {
    return hmac.create(sha256, salt).update(privateKey).digest();
}
export function deriveSharedSecret(privateKey, publicKey) {
    return nacl.scalarMult(privateKey, publicKey);
}
export function getX25519PublicKey(privateKey) {
    return nacl.scalarMult.base(privateKey);
}
export function encryptECDH(privateKey, nodePublicKey, data) {
    try {
        // Derive shared key
        const sharedSecret = deriveSharedSecret(privateKey, nodePublicKey);
        // Derive encryption key
        const encryptionKey = deriveEncryptionKey(sharedSecret, stringToU8a(TX_KEY_PREFIX));
        // Encrypt data
        const encryptionResult = encrypt(encryptionKey, data);
        if (encryptionResult.error) {
            return encryptionResult;
        }
        // Add user public key as prefix
        const userPublicKey = getX25519PublicKey(privateKey);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return { result: u8aConcat(userPublicKey, encryptionResult.result) };
    }
    catch (e) {
        if (typeof e === 'string') {
            return { error: e };
        }
        else if (e instanceof Error) {
            return { error: e.message };
        }
        else {
            return { error: 'encryptECDH error' };
        }
    }
}
export function decryptECDH(privateKey, nodePublicKey, encryptedData) {
    try {
        // Derive shared key
        const sharedSecret = deriveSharedSecret(privateKey, nodePublicKey);
        // Derive encryption key
        const encryptionKey = deriveEncryptionKey(sharedSecret, stringToU8a(TX_KEY_PREFIX));
        // Encrypt data
        return decrypt(encryptionKey, encryptedData);
    }
    catch (e) {
        if (typeof e === 'string') {
            return { error: e };
        }
        else if (e instanceof Error) {
            return { error: e.message };
        }
        else {
            return { error: 'decryptECDH error' };
        }
    }
}
export function encrypt(privateKey, data) {
    try {
        const nonce = randomBytes(deoxysii.NonceSize);
        const ad = randomBytes(deoxysii.TagSize);
        const cipher = new deoxysii.AEAD(privateKey);
        const ciphertext = cipher.encrypt(nonce, data, ad);
        const encryptedData = u8aConcat(nonce, ad, ciphertext);
        return { result: encryptedData };
    }
    catch (e) {
        if (typeof e === 'string') {
            return { error: e };
        }
        else if (e instanceof Error) {
            return { error: e.message };
        }
        else {
            return { error: 'decryption error' };
        }
    }
}
export function decrypt(privateKey, encryptedData) {
    try {
        const nonce = encryptedData.subarray(0, deoxysii.NonceSize);
        const ad = encryptedData.subarray(deoxysii.NonceSize, deoxysii.NonceSize + deoxysii.TagSize);
        const ciphertext = encryptedData.subarray(deoxysii.NonceSize + deoxysii.TagSize);
        const cipher = new deoxysii.AEAD(privateKey);
        const plaintext = cipher.decrypt(nonce, ciphertext, ad);
        return { result: plaintext };
    }
    catch (e) {
        if (typeof e === 'string') {
            return { error: e };
        }
        else if (e instanceof Error) {
            return { error: e.message };
        }
        else {
            return { error: 'decryption error' };
        }
    }
}
//# sourceMappingURL=encryption.js.map