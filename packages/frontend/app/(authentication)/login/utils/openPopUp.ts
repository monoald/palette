let windowObjectReference: Window | null = null;
let previousUrl: string | null = null;

export const openPopUp = (url: string, name: string, callback: (e: MessageEvent) => void) => {
  window.removeEventListener('message', callback);

  const left = (screen.width - 400) / 2;
  const top = (screen.height - 500) / 2;

  const strWindowFeatures =
    `toolbar=no, menubar=no, location=no, width=400, height=500, top=100, left=${left}, top=${top}`;

  if (windowObjectReference === null || windowObjectReference.closed) {
    windowObjectReference = window.open(url, name, strWindowFeatures);
  } else if (previousUrl !== url) {
    windowObjectReference = window.open(url, name, strWindowFeatures);
    windowObjectReference?.focus();
  } else {
    windowObjectReference.focus();
  }

  window.addEventListener('message', event => callback(event), false);
  previousUrl = url;
};