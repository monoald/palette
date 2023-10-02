const avatars = [
  'bear', 'bee', 'bull', 'cat', 'chicken', 'frog', 'gorilla',
  'hedgehog', 'jaguar', 'jellyfish', 'lizard', 'orangutan', 'owl',
  'penguin', 'pig', 'polar-bear', 'rabbit', 'walrus', 'wolf'
]

export function validateAvatar(avatar: string): boolean {
  return avatars.includes(avatar)
}