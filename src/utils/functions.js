import moment from 'moment';
import { AREAS, MONTHS, DAYS } from '../constants';
import store from '../reducers/index';

export const areaFunctionReturn = ({ area, sports, hairdressers }) => {
  if (!area) {
    const state = store.getState();
    area = state.commerceData.area.areaId;
  }

  switch (area) {
    case AREAS.sports:
      return sports;
    case AREAS.hairdressers:
      return hairdressers;
    default:
      return sports;
  }
};

export const formattedMoment = (date = moment()) => {
  // receives moment date and returns the same date at 00:00 in moment format
  // if not receive a date as param, returns the current date
  return moment([date.year(), date.month(), date.date()]);
};

export const getHourAndMinutes = hour => {
  // receives string hour (HH:mm) and returns and object that contains 2 props, the hour and the minutes
  hour = hour.split(':').map(num => parseInt(num));
  return { hour: hour[0], minutes: hour[1] };
};

export const hourToDate = (stringHour, date = moment()) => {
  // receives string hour (HH:mm) and returns the current date at that hour in moment format
  const { hour, minutes } = getHourAndMinutes(stringHour);
  return moment([date.year(), date.month(), date.date(), hour, minutes]);
};

export const imageToBlob = async uri => {
  try {
    // convierte una imagen desde una uri a un blob para que se pueda subir a firebase storage
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    return blob;
  } catch (error) {
    console.error(error);
  }
};

//Función para eliminar espacios vacíos antes y después de un string.
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
  } catch (error) {
    return [];
  }
};
/**
 * Función para eliminar espacios vacíos antes y despues de un string, y eliminar espacios dobles.
 * @param {String} string  string a formatear
 * Valida que el valor sea un array y devuelve el valor trimeado.
 * Si llega a no ser un string. Devuelve un string vacío
 */
export const trimString = string => {
  try {
    const res = trimStrings([string]);
    if (res.length) return res[0];
  } catch (error) {
    return '';
  }
};

/**
 * Función para eliminar doble espacios vacíos.
 * @param {String}   value  string a formatear
 * Si llega a haber un error, devuelve un string vacío
 */
export const removeDoubleSpaces = value => {
  try {
    return value.replace(/  +/g, ' ');
  } catch (error) {
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
      return value.length && value.trim();
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
  //regex para cuit únicamente de negocio
  const cuitRe = /\b(20|23|24|27|30|33|34)(\D)?[0-9]{8}(\D)?[0-9]/g;

  if (!cuitRe.test(String(cuit))) {
    return false;
  }

  if (cuit.length != 11) {
    return false;
  }

  let acumulado = 0;
  const digitos = cuit.split('');
  const digito = digitos.pop();

  for (let i = 0; i < digitos.length; i++) {
    acumulado += digitos[9 - i] * (2 + (i % 6));
  }

  let verif = 11 - (acumulado % 11);
  if (verif == 11) {
    verif = 0;
  }

  return digito == verif;
};

/**
 * Formats the input value (minutes) into a String containing the hours and
 * minutes that are equivalent to the input value for easier readability.
 * @param  {Integer} totalMins The amount of minutes to format
 * @return {String}            String with the following format: 'XX h. XX mins.'
 */
export const stringFormatMinutes = totalMins => {
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;

  if (hours && mins) return hours + ' h ' + mins + ' mins.';
  else if (hours) return hours + ' h.';
  else return mins + ' mins.';
};

/**
 * Formats the input value (days) into a String containing the months and
 * days that are equivalent to the input value for easier readability.
 * @param  {Integer} totalDays The amount of days to format
 * @return {String}            String with the following format: 'XX meses y XX días.'
 */
export const stringFormatDays = totalDays => {
  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;

  const stringMonths = months + (months == 1 ? ' mes' : ' meses');

  const stringDays = days + (days == 1 ? ' día' : ' días');

  if (months && days) return stringMonths + ' y ' + stringDays + '.';
  else if (months) return stringMonths + '.';
  else return stringDays + '.';
};

/**
 * Formats the input value (hours) into a String containing the hours and
 * days that are equivalent to the input value for easier readability.
 * @param  {Integer} totalHours The amount of minutes to format
 * @return {String}            String with the following format: 'XX day. XX hours.'
 */
export const stringFormatHours = totalHours => {
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  const stringHours = hours + (hours == 1 ? ' hora' : ' horas');

  const stringDays = days + (days == 1 ? ' día' : ' días');

  if (hours && days) return stringDays + ' y ' + stringHours + '.';
  else if (hours) return stringHours + '.';
  else return stringDays + '.';
};

export const isOneWeekOld = date => {
  return !moment()
    .subtract(1, 'w')
    .isBefore(date);
};

/**
 * Función para tener un formato único de envío de notificación al comercio
 * a la hora de reservarle un turno.
 * @param {Date}    startDate   La fecha de inicio del turno
 * @param {String}  actorName   Nombre de quién reserva
 * @return {String, String}     Título (title) y cuerpo (body) del mensaje
 */
export const newReservationNotificationFormat = ({ startDate, service, actorName, receptorName }) => {
  const dayOfWeek = DAYS[startDate.day()];
  const dayOfMonth = startDate.format('D');
  const month = MONTHS[moment(startDate).month()];
  const formattedTime = moment(startDate).format('HH:mm');

  return {
    title: 'Nueva Reserva',
    body: `${receptorName}! ${actorName} ha reservado "${service}" para el día ${dayOfWeek} ${dayOfMonth} de ${month} a las ${formattedTime}`
  };
};

/**
 * Función para tener un formato único de envío de notificación al comercio
 * o cliente a la hora de cancelar un turno.
 * @param {Date}    startDate           La fecha de inicio del turno
 * @param {String}  actorName           Nombre de quién cancela
 * @param {String}  cancellationReason  Motivo de cancelación si cancela un negocio
 * @return {String, String}             Título (title) y cuerpo (body) del mensaje
 */
export const cancelReservationNotificationFormat = ({
  startDate,
  service,
  actorName,
  receptorName,
  cancellationReason
}) => {
  const dayOfWeek = DAYS[startDate.day()];
  const dayOfMonth = startDate.format('D');
  const month = MONTHS[moment(startDate).month()];
  const formattedTime = moment(startDate).format('HH:mm');
  let body = `${receptorName}! ${actorName} te ha cancelado "${service}" reservado el día ${dayOfWeek} ${dayOfMonth} de ${month} a las ${formattedTime}.`;
  body += `${cancellationReason ? ` Motivo: "${cancellationReason}".` : ''}`;

  return {
    title: 'Reserva Cancelada',
    body
  };
};

/**
 * Formats the input value (minutes) into a String containing days, hours or
 * minutes that are equivalent to the input value for easier readability.
 * @param  {Integer} totalMins The amount of minutes to format
 * @return {String}            String with the following format: 'XX h. XX mins.'
 */
export const notificationsToFormatString = totalMins => {
  if (totalMins < 2) return '1 min.';
  if (totalMins < 60) return totalMins + ' mins.';

  const hours = Math.floor(totalMins / 60);
  if (totalMins < 1440) return hours + (hours == 1 ? ' hora.' : ' horas.');

  const days = Math.floor(totalMins / 1440);
  if (days < 30) return days + (days == 1 ? ' día.' : ' días.');

  const months = Math.floor(days / 30);
  if (days < 365) return months + (months == 1 ? ' mes.' : ' meses.');

  const years = Math.floor(days / 365);
  return years + (years == 1 ? ' año.' : ' años.');
};
