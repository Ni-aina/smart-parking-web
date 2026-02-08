
const checkSessionExpired = (expiresAt: number|null)=> {
  if (!expiresAt) return true;
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= expiresAt;
}

export default checkSessionExpired;