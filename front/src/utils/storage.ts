export const getToken = (roomId: string) => localStorage.getItem(roomId);

export const setToken = (roomId: string, token: string) =>
  localStorage.setItem(roomId, token);

export const resetToken = (roomId: string) => localStorage.removeItem(roomId);