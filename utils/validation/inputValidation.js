import validate from 'validate.js'

export const inputValidation = (type, text) => {
  if (type === 'email') {
    let constraints = {
      [type]: {
        email: {
          message: "doesn't look like a valid email"
        }
      }
    };
    const email = validate({ [type]: text }, constraints);
    return email && email[type][0]
  }
  if (type == 'name') {
    let constraints = {
      [type]: {
        presence: {
          allowEmpty: false,
          message: "can't be blank",
        }
      }
    };
    const name = validate({ [type]: text }, constraints);
    return name && name[type][0]
  }
  if (type == 'password') {
    let constraints = {
      [type]: {
        presence: {
          allowEmpty: false,
          message: "can't be blank"
        },
        length: {
          minimum: 8,
          message: "must be at least 8 characters"

        }
      }
    };
    const password = validate({ [type]: text }, constraints);
    return password && password[type][password[type].length - 1]
  }
}