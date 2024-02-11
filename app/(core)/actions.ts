type PaletaErrorConstructor = {
  statusCode: number;
  error: string;
  message: string;
};
export class PaletaError extends Error {
  statusCode: number;
  error: string;

  constructor({ statusCode, error, message }: PaletaErrorConstructor) {
    super(message);
    this.name = "PaletaError";
    this.statusCode = statusCode;
    this.error = error;
  }
}

export async function saveColor(token: string, color: string) {
  const isSaved = await fetch("http://localhost:3000/api/v1/colors/save", {
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
  const isUnsaved = await fetch("http://localhost:3000/api/v1/colors/unsave", {
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
