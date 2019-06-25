export const validateValueType = (type, value) => {
  switch (type) {
    case 'int':
      return Number.isInteger(parseInt(value)) && parseInt(value) > 0;
    case 'number':
      return !isNaN(parseFloat(value)) && !isNaN(value - 0);
    case 'string':
      return value.length > 0 && value.trim();
    case 'email':
      const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailRe.test(String(value).toLowerCase());
    case 'password':
      //alfanumerica y minimo 6 caracteres
      const passRe = /^(?=.*\d)[0-9a-zA-Z]{6,}$/;
      return passRe.test(String(value));
    default:
      return null;
  }
};
