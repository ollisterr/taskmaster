export const createMessage = (message: string) => ({
  message,
  timestamp: new Date().toISOString(),
});

const characterMap: Record<string, string> = {
  ä: 'a',
  ö: 'o',
  å: 'a',
};

export const formatUrl = (rawUrl: string) => {
  return rawUrl
    .trim()
    .toLowerCase()
    .replace(/[äåö]/g, (x) => characterMap[x])
    .replace(/\W/g, '-');
};
