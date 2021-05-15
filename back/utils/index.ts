export const createMessage = (message: string) => ({
  message,
  timestamp: new Date().toISOString(),
});
