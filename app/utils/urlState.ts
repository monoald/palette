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

export function setParams(
  params: { name: string; value: string | number | null }[]
): string {
  const search = window.location.search;
  const urlParams = new URLSearchParams(search);

  for (const param of params) {
    if (param.value) {
      urlParams.set(param.name, `${param.value}`);
    } else {
      urlParams.delete(param.name);
    }
  }

  history.replaceState({}, "", "?" + urlParams.toString());

  return "?" + urlParams.toString();
}
