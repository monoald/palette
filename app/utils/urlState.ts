export function replacePath(path: string): void {
  const search = window.location.search || null;

  if (search) {
    history.replaceState({}, "", path + search);
    return;
  }

  history.replaceState({}, "", path);
}

export function getParam(name: string): string | null {
  const search = window.location.search;
  const params = new URLSearchParams(search);

  return params.get(name);
}

export function setParam(name: string, value: string | number | null): void {
  const search = window.location.search;
  const params = new URLSearchParams(search);

  if (value) {
    params.set(name, `${value}`);
  } else {
    params.delete(name);
  }

  history.replaceState({}, "", "?" + params.toString());
}
