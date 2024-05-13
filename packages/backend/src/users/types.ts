type User = {
  id?: number;
  email: string;
  name: string;
  username: string;
  avatar: string;
  provider: Provider;
};

type Provider = "google" | "github" | "facebook";
