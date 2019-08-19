export const imageToBlob = async uri => {
  // convierte una imagen desde una uri a un blob para que se pueda subir a firebase storage

  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function() {
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  return blob;
};

//Funcion para eliminar espacios vacios antes y despues de un string.
//@param: strings -> es un array de strings
//Valida que el parametro sea un array y devuelve un array de los valores trimeados.
//Si llega a no ser un array de strings. Devuelve un array vacio
const trimStrings = strings => {
  try {
    const spaces = strings.map(string => removeDoubleSpaces(string));
    return spaces.map(string => {
      const res = string.trim();
      res.replace(/  +/g, ' ');
      return res;
    });
  } catch (err) {
    return [];
  }
};

//Función para eliminar espacios vacíos antes y despues de un string, y eliminar espacios dobles.
//@param: string -> es string
//Valida que el valor sea un array y devuelve el valor trimeado.
//Si llega a no ser un string. Devuelve un string vacío
export const trimString = string => {
  try {
    const res = trimStrings([string]);
    if (res.length > 0) return res[0];
  } catch (err) {
    return '';
  }
};

//Función para eliminar doble espacios vacíos.
//@param: value -> string
//Si llega a haber un error, devuelve un string vacío
export const removeDoubleSpaces = value => {
  try {
    return value.replace(/  +/g, ' ');
  } catch (err) {
    return '';
  }
};

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
      //alfanumérica, de mínimo 6 caracteres y máximo 16
      // al menos un dígito numérico y una minúscula
      const passRe = /^(?=\w*\d)(?=\w*[a-z])\S{6,16}$/;
      return passRe.test(String(value));
    case 'cuit':
      return validarCuit(value);
    case 'name':
      const nameRe = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s\-,.'"´`]+$/;
      return nameRe.test(String(value));
    case 'phone':
      const phoneRe = /^[+]{0,1}[(]{0,1}[0-9]*[)]{0,1}[\s]{0,1}[0-9]+[\s-]{0,1}[0-9]+[\s-]{0,1}[0-9]+[\s-]{0,1}[0-9]+$/;
      return phoneRe.test(String(value));
    default:
      return null;
  }
};

const validarCuit = cuit => {
<<<<<<< HEAD
  //regex para cuit únicamente de negocio
=======
  //regex para cuit unicamente de negocio
>>>>>>> develop
  const cuitRe = /\b(30|33|34)(\D)?[0-9]{8}(\D)?[0-9]/g;

  if (!cuitRe.test(String(cuit))) {
    return false;
  }

  if (cuit.length != 11) {
    return false;
  }

  var acumulado = 0;
  var digitos = cuit.split('');
  var digito = digitos.pop();

  for (var i = 0; i < digitos.length; i++) {
    acumulado += digitos[9 - i] * (2 + (i % 6));
  }

  var verif = 11 - (acumulado % 11);
  if (verif == 11) {
    verif = 0;
  }

  return digito == verif;
};
