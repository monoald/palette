export function makeRandomID(): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const length = Math.floor(Math.random() * (128 - 43 + 1)) + 43;

  const randomString = Array.from({ length }, () => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters.charAt(randomIndex);
  }).join("");

  return randomString;
}
