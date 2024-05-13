type PaletaErrorConstructor = {
  statusCode: number;
  message: string;
};
export class PaletaError extends Error {
  statusCode: number;

  constructor({ statusCode, message }: PaletaErrorConstructor) {
    super(message);
    this.name = "PaletaError";
    this.statusCode = statusCode;
    this.message = message;
  }
}

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

export async function saveColor(token: string, color: string) {
  const isSaved = await fetch(`${SERVER_URI}/colors/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `bearer ${token}`,
    },
    body: JSON.stringify({ name: color }),
  });

  if (isSaved.status !== 200) {
    const er: PaletaErrorConstructor = await isSaved.json();
    throw new PaletaError(er);
  }
}

export async function unsaveColor(token: string, color: string) {
  const isUnsaved = await fetch(`${SERVER_URI}/colors/unsave`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `bearer ${token}`,
    },
    body: JSON.stringify({ name: color }),
  });

  if (isUnsaved.status !== 200) {
    const er: PaletaErrorConstructor = await isUnsaved.json();
    throw new PaletaError(er);
  }
}

export async function savePalette(token: string, name: string) {
  const isSaved = await fetch(`${SERVER_URI}/palettes/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  if (isSaved.status !== 200) {
    // const er: PaletaErrorConstructor = await isSaved.json();
    const errorMessage = await isSaved.text();
    throw new PaletaError({
      statusCode: isSaved.status,
      message: errorMessage,
    });
  }
}

export async function unsavePalette(token: string, name: string) {
  const isUnsaved = await fetch(`${SERVER_URI}/palettes/unsave`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  if (isUnsaved.status !== 200) {
    const er: PaletaErrorConstructor = await isUnsaved.json();
    throw new PaletaError(er);
  }
}

export async function saveGradient(token: string, name: string) {
  const isSaved = await fetch(`${SERVER_URI}/gradients/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  if (isSaved.status !== 200) {
    const er: PaletaErrorConstructor = await isSaved.json();
    throw new PaletaError(er);
  }
}

export async function unsaveGradient(token: string, name: string) {
  const isUnsaved = await fetch(`${SERVER_URI}/gradients/unsave`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  if (isUnsaved.status !== 200) {
    const er: PaletaErrorConstructor = await isUnsaved.json();
    throw new PaletaError(er);
  }
}
