const crypto = require("crypto");

// Function to encrypt a message using AES-128-CBC
function aesEncrypt(text, secretKey) {
  // Your implementation here
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-128-cbc", secretKey, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    encryptedMessage: encrypted,
    iv: iv.toString("hex"),
  };
}

// Function to decrypt a message using AES-128-CBC
function aesDecrypt(encryptedMessage, secretKey, ivHex) {
  // Your implementation here
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv("aes-128-cbc", secretKey, iv);

  let decrypted = decipher.update(encryptedMessage, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

// Test your functions
const secretKey = Buffer.from("mysecretkey12345"); // 16-byte key (128-bit)
const textToEncrypt = "It's snowing outside!";

// Encrypt the message
const { encryptedMessage, iv } = aesEncrypt(textToEncrypt, secretKey);
console.log("Encrypted Message:", encryptedMessage);
console.log("IV:", iv);

// Decrypt the message
const decryptedMessage = aesDecrypt(encryptedMessage, secretKey, iv);
console.log("Decrypted Message:", decryptedMessage);
