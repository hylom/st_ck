
export function pushItem(item) {
  const data = { username: "hylom" };
  Object.assign(data, item);
  const url = "/api/item";
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  return fetch(url, options)
    .then(resp => resp.json());
};

export function getItems() {
  const url = "/api/item";
  return fetch(url)
    .then(resp => resp.json());
};
