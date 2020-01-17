const functions = require('firebase-functions');
const env = require('./environment');
const express = require('express');
const engines = require('consolidate');
const mercadopago = require('mercadopago');
const request = require('request');
const admin = require('firebase-admin');
const moment = require('moment');
let serviceAccount = require('./turnosYaServiceAccountKey.json');
const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.engine('ejs', engines.ejs);
app.set('views', './views');
app.set('view engine', 'ejs');

//#region Payment
app.get('/pay', (req, res) => {
  mercadopago.configure({
    sandbox: true,
    access_token: req.query['access-token']
  });

  const preference = {
    items: [
      {
        title: 'Reserva en TurnosYa',
        unit_price: parseInt(req.query.price),
        quantity: 1
      }
    ],
    payer: {
      email: req.query['email'] || 'example@example.com',
      identification: {
        type: 'clientId',
        number: req.query['client-id'] || ''
      }
    },
    back_urls: {
      // success: 'localhost:5000/payment-success', // son endpoints
      success: 'https://proyecto-turnosya.web.app/payment-success',
      failure: 'https://proyecto-turnosya.web.app/payment-failure'
    },
    auto_return: 'approved',
    external_reference: `{"clientId":"${req.query['client-id']}","reservationId":"${req.query['reservation-id']}","commerceId":"${req.query['commerce-id']}"}`
  };

  mercadopago.preferences
    .create(preference)
    .then(function(mpagoResp) {
      console.log('Nueva reponse de creación de preferencia');
      console.log(mpagoResp);
      console.log('-----------------------------');

      res.render('pay', {
        init_point: mpagoResp.body.init_point,
        sandbox_init_point: mpagoResp.body.sandbox_init_point
      });
    })
    .catch(function(error) {
      console.log(error);
    });
});

app.get('/payment-success', (req, res) => {
  console.log('Nueva request de success');
  console.log('Headers \n' + JSON.stringify(req.query));
  // collection_id
  // collection_status
  // external_reference
  // payment_type
  // merchant_order_id
  // reference_id
  // merchant_account_id
  let {
    collection_id,
    collection_status,
    payment_type,
    merchant_order_id,
    reference_id,
    merchant_account_id
  } = req.query;
  let { clientId, reservationId, commerceId } = JSON.parse(
    req.query.external_reference
  );

  console.log(clientId);
  console.log(reservationId);
  console.log(commerceId);

  const db = admin.firestore();

  const paymentRef = db.collection(`Commerces/${commerceId}/Payments`).doc();
  const reservationRef = db
    .collection(`Commerces/${commerceId}/Reservations`)
    .doc(reservationId);

  const batch = db.batch();

  batch.create(paymentRef, {
    clientId,
    reservationId,
    date: new Date(),
    method: env.paymentTypes[payment_type],
    collectionId: collection_id,
    collectionStatus: collection_status,
    merchantOrderId: merchant_order_id,
    referenceId: reference_id,
    merchantAccountId: merchant_account_id
  });

  batch.update(reservationRef, { paymentDate: new Date() });

  batch
    .commit()
    .then(() => console.log('Guardado en Firestore'))
    .catch(err => console.log('Firestore error: ' + err));

  // admin
  //   .firestore()
  //   .collection(`Commerces/${commerceId}/Payments`)
  //   .add({
  //     clientId,
  //     reservationId,
  //     date: new Date(),
  //     method: env.paymentTypes[payment_type],
  //     collectionId: collection_id,
  //     collectionStatus: collection_status,
  //     merchantOrderId: merchant_order_id,
  //     referenceId: reference_id,
  //     merchantAccountId: merchant_account_id
  //   })
  //   .then(() => console.log('Guardado en Firestore'))
  //   .catch(err => console.log('Firestore error: ' + err));

  console.log('---------------------');
  res.render('payment-success');
});

app.get('/payment-failure', (req, res) => {
  res.render('payment-failure');
});
//#endregion

//#region OAuth
app.get('/commerce-oauth', (req, res) => {
  res.render('commerce-oauth', {
    appId: env.marketplace.APP_ID,
    commerceId: req.query['commerce-id']
  });
});

app.get('/commerce-oauth-redirect', (req, res) => {
  console.log('Nuevo redirect!');
  console.log(req.query); // req.query.code

  var headers = {
    accept: 'application/json',
    'content-type': 'application/x-www-form-urlencoded'
  };

  console.log(
    'clientId: ' +
      env.marketplace.APP_ID +
      ' - clientsecret: ' +
      env.marketplace.SECRET_KEY
  );
  var dataString = `client_id=${env.marketplace.APP_ID}&client_secret=${env.marketplace.SECRET_KEY}&grant_type=authorization_code&code=${req.query.code}&redirect_uri=https%3A%2F%2Fproyecto-turnosya.web.app%2Fcommerce-oauth-redirect%3Fcommerce-id%3D${req.query['commerce-id']}`;

  var options = {
    url: 'https://api.mercadopago.com/oauth/token',
    method: 'POST',
    headers: headers,
    body: dataString
  };

  function callback(error, response, body) {
    const db = admin.firestore();
    console.log(error);
    console.log(response.statusCode);
    if (!error && response.statusCode == 200) {
      console.log(body);
      let data = JSON.parse(body);

      db.doc(
        `Commerces/${req.query['commerce-id']}/MercadoPagoTokens/${data.access_token}`
      )
        .set({
          publicKey: data.public_key,
          refreshToken: data.refresh_token,
          userId: data.user_id,
          expirationDate: new Date(moment().add('seconds', data.expires_in))
        })
        .then(() => {
          console.log('Guardado en Firestore');
          res.render('commerce-oauth-redirect');
        })
        .catch(err => console.log('Firestore error: ' + err));
    }
  }

  request(options, callback);
});
//#endregion

exports.app = functions.https.onRequest(app);
