export const post = async (url: string, body: any) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  })
  const responseJson = await response.json();

  if (!response.ok) {
    throw Error(responseJson.message);
  }

  return responseJson;
}

export default { post };