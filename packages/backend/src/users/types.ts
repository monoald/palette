type User = {
  id?: number;
  email: string;
  name: string;
  username: string;
  avatar: string;
  provider: Provider;
  //  signinKey?: string,
  //  createdAt: string
};

type Provider = "google" | "github" | "facebook";
