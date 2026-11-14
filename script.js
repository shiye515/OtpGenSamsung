const SECRET_KEY_HEX = "120395F099840593405B03838449A72933484040A3034750C0403938290A293B";
const TIME_STEP_X = 300;
const CODE_DIGITS = 6;
const DIGIT_DECIMAL = 10 ** CODE_DIGITS;

function hexToBytes(hex) {
  if (hex.length % 2 !== 0) {
    throw new Error("Invalid hex length");
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

function isNumeric6Digits(value) {
  return /^\d{6}$/.test(value);
}

async function hmacSha256(keyBytes, messageBytes) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageBytes);
  return new Uint8Array(signature);
}

async function generateTotpNonce(timeHex, nonce) {
  const useNonceMode = isNumeric6Digits(nonce);
  const messageHex = useNonceMode ? `${nonce}${timeHex}` : timeHex;
  const paddingLength = useNonceMode ? 22 : 16;
  const paddedHex = messageHex.padStart(paddingLength, "0");

  const messageBytes = hexToBytes(paddedHex);
  const secretKeyBytes = hexToBytes(SECRET_KEY_HEX);
  const hmacHash = await hmacSha256(secretKeyBytes, messageBytes);

  const offset = hmacHash[hmacHash.length - 1] & 0x0f;
  let largeInt =
    ((hmacHash[offset] & 0x7f) << 24) |
    ((hmacHash[offset + 1] & 0xff) << 16) |
    ((hmacHash[offset + 2] & 0xff) << 8) |
    (hmacHash[offset + 3] & 0xff);

  largeInt &= 0x7fffffff;

  const otpValue = largeInt % DIGIT_DECIMAL;
  return otpValue.toString().padStart(6, "0");
}

export async function generateOtp6Digit({ timestampSeconds, nonce }) {
  const timeStep = Math.floor(timestampSeconds / TIME_STEP_X);
  const timeHex = timeStep.toString(16).toUpperCase().padStart(16, "0");
  return generateTotpNonce(timeHex, nonce ?? "");
}

const form = document.getElementById("otp-form");
const timeInput = document.getElementById("time-input");
const nonceInput = document.getElementById("nonce-input");
const otpOutput = document.getElementById("otp");

const now = new Date();
const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 16);
timeInput.value = localISO;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const parsedTime = timeInput.value ? new Date(timeInput.value) : new Date();
  const timestampSeconds = Math.floor(parsedTime.getTime() / 1000);
  const nonce = nonceInput.value.trim();

  if (!Number.isFinite(timestampSeconds)) {
    otpOutput.textContent = "时间格式无效";
    return;
  }

  try {
    const otp = await generateOtp6Digit({ timestampSeconds, nonce });
    otpOutput.textContent = otp;
  } catch (error) {
    otpOutput.textContent = `生成失败: ${error.message}`;
  }
});
