export const AuthReducer = (state, action) => {
  let updatedState = { ...state }
  if (action.type === 'email') {
    updatedState = {
      ...state,
      email: {
        value: action.value,
        isValid: action.isValid,
        errorMessage: action.errorMessage
      }
    }
  }
  if (action.type === 'password') {
    updatedState = {
      ...state,
      password: {
        value: action.value,
        isValid: action.isValid,
        errorMessage: action.errorMessage
      }
    }
  }
  if (action.type === 'name') {
    updatedState = {
      ...state,
      name: {
        value: action.value,
        isValid: action.isValid,
        errorMessage: action.errorMessage
      }
    }
  }
  //map over all the isValid property of state and if any of them is false set completeFormValid value to false
  const updatedkeys = Object.keys(updatedState).filter(item => item !== 'completeFormValid')
  const updatedValues = updatedkeys.map(item => updatedState[item].isValid)
  const isFormValid = updatedValues.every(item => item === true)
  updatedState = {
    ...updatedState,
    completeFormValid: {
      value: isFormValid
    }
  }
  return updatedState

}