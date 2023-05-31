import { reactive } from 'vue'

const validateEmail = (email: string): boolean => {
  if (email.match(
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  )) {
    return true
  }
  return false
}

const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const regex = /^\d{10}$/
  return regex.test(phoneNumber)
}

const verifyPassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 6) {
    return {
      valid: false,
      message: 'Your password must be at least 6 characters long',
    }
  }
  else if (password.length > 20) {
    return {
      valid: false,
      message: 'Your password must be less than 20 characters long',
    }
  }
  else if (password.search(/\d/) === -1) {
    return {
      valid: false,
      message: 'Your password must contain at least one number',
    }
  }
  else if (password.search(/[a-zA-Z]/) === -1) {
    return {
      valid: false,
      message: 'Your password must contain at least one letter',
    }
  }
  else if (password.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) !== -1) {
    return {
      valid: false,
      message: 'Your password must contain only letters, numbers, and the following symbols: !@#$%^&*()_+',
    }
  }
  else {
    return {
      valid: true,
      message: 'Your password is valid',
    }
  }
}

interface iValidate {
  class: any
  message: any
}

export const validate: iValidate = reactive({
  class: {},
  message: {},
})

export const resetValidation = (): void => {
  validate.class = {}
  validate.message = {}
}

export const validateFields = (obj: any, rules: any): boolean => {
  validate.class = {}
  validate.message = {}
  let isValid = true
  Object.keys(rules).forEach((key: string) => {
    const rule = rules[key]
    const checkValue = key.split('.').reduce((o, i) => o[i], obj)
    if (rule.required && rule.type === 'string' && checkValue === '') {
      validate.class[key] = 'ion-invalid'
      validate.message[key] = `${rule.pretty} is required`
      isValid = false
    }
    else if (rule.required && rule.type === 'email' && checkValue === '') {
      validate.class[key] = 'ion-invalid'
      validate.message[key] = `${rule.pretty} is required`
      isValid = false
    }
    else if (rule.type === 'phone' && !isValidPhoneNumber(checkValue)) {
      validate.class[key] = 'ion-invalid'
      validate.message[key] = `${rule.pretty} is not valid must be 10 digits`
      isValid = false
    }
    else if (rule.type === 'email' && !validateEmail(checkValue)) {
      validate.class[key] = 'ion-invalid'
      validate.message[key] = `${rule.pretty} is not valid`
      isValid = false
    }
    else if (rule.type === 'password' && !verifyPassword(checkValue).valid) {
      validate.class[key] = 'ion-invalid'
      validate.message[key] = verifyPassword(checkValue).message
      isValid = false
    }
    else if (rule.required && rule.type === 'array' && checkValue.length === 0) {
      validate.class[key] = 'ion-invalid'
      validate.message[key] = `${rule.pretty} is required`
      isValid = false
    }
    else {
      validate.class[key] = 'ion-valid'
      validate.message[key] = ''
    }
  })
  return isValid
}
