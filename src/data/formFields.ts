export type ValidFields = 'email' | 'username' | 'password'

interface Field {
  regEx: RegExp
  errorMessage: string
}

export type FormFields = {
  [key in ValidFields]: Field[]
}

export const formFields: FormFields = {
  'email': [
    {
      regEx: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/,
      errorMessage: 'Invalid email'
    }
  ],
  'username': [
    {
      regEx: /^.{4,15}$/,
      errorMessage: 'Username must have between 4 and 15 characters'
    },
    {
      regEx: /^[A-Za-z0-9_]+$/,
      errorMessage: 'Username use only letters, numbers and underscores'
    }
  ],
  'password': [
    {
      regEx: /^.{6,}$/,
      errorMessage: 'Password must have at least 6 characters'
    },
    {
      regEx: /[a-z]/,
      errorMessage: 'Password must have at least 1 lowercase letter'
    },
    {
      regEx: /[A-Z]/,
      errorMessage: 'Password must have at least 1 uppercase letter'
    },
    {
      regEx: /\d/,
      errorMessage: 'Password must have at least 1 number'
    },
    {
      regEx: /[!@#$%^&*(),.?":{}|<>]/,
      errorMessage: 'Password must have at least 1 symbol'
    },
  ]
}