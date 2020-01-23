const functions = require('firebase-functions');
const env = require('./environment');
const constants = require('./constants');
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
app.use(express.static('public'));

//#region Payment
app.get('/pay', (req, res) => {
  mercadopago.configure({
    access_token: req.query['access-token']
  });

  const preference = {
    items: [
      {
        title: 'Reserva en TurnosYa',
        // unit_price: parseInt(req.query.price),
        unit_price: 1,
        quantity: 1
      }
    ],
    notification_url: 'https://proyecto-turnosya.web.app/ipn-notification',
    external_reference: `{"clientId":"${req.query['client-id']}","reservationId":"${req.query['reservation-id']}","commerceId":"${req.query['commerce-id']}"}`
  };

  mercadopago.preferences
    .create(preference)
    .then(function(mpagoResp) {
      res.render('pay', {
        init_point: mpagoResp.body.init_point,
        sandbox_init_point: mpagoResp.body.sandbox_init_point
      });
    })
    .catch(function(error) {
      console.log(error);
    });
});
//#endregion

//#region
// app.get('/payment-success', (req, res) => {
//   console.log('Nueva request de success');
//   console.log('Headers \n' + JSON.stringify(req.query));
//   // collection_id
//   // collection_status
//   // external_reference
//   // payment_type
//   // merchant_order_id
//   // preference_id
//   // merchant_account_id
//   let {
//     collection_id,
//     collection_status,
//     payment_type,
//     merchant_order_id,
//     preference_id,
//     merchant_account_id
//   } = req.query;
//   let { clientId, reservationId, commerceId } = JSON.parse(req.query.external_reference);

//   console.log(clientId);
//   console.log(reservationId);
//   console.log(commerceId);

//   const db = admin.firestore();

//   const paymentRef = db.collection(`Commerces/${commerceId}/Payments`).doc();
//   const commerceReservationRef = db.collection(`Commerces/${commerceId}/Reservations`).doc(reservationId);
//   const clientReservationRef = db.collection(`Profiles/${clientId}/Reservations`).doc(reservationId);

//   const batch = db.batch();

//   batch.create(paymentRef, {
//     clientId,
//     reservationId,
//     date: new Date(),
//     method: env.paymentTypes[payment_type],
//     collectionId: collection_id,
//     collectionStatus: collection_status,
//     merchantOrderId: merchant_order_id,
//     preferenceId: preference_id,
//     merchantAccountId: merchant_account_id
//   });

//   batch.update(commerceReservationRef, { paymentDate: new Date() });
//   batch.update(clientReservationRef, { paymentDate: new Date() });

//   batch
//     .commit()
//     .then(() => console.log('Guardado en Firestore'))
//     .catch(err => console.log('Firestore error: ' + err));

//   // admin
//   //   .firestore()
//   //   .collection(`Commerces/${commerceId}/Payments`)
//   //   .add({
//   //     clientId,
//   //     reservationId,
//   //     date: new Date(),
//   //     method: env.paymentTypes[payment_type],
//   //     collectionId: collection_id,
//   //     collectionStatus: collection_status,
//   //     merchantOrderId: merchant_order_id,
//   //     referenceId: preference_id,
//   //     merchantAccountId: merchant_account_id
//   //   })
//   //   .then(() => console.log('Guardado en Firestore'))
//   //   .catch(err => console.log('Firestore error: ' + err));

//   console.log('---------------------');
//   res.render('payment-success');
// });

// app.get('/payment-failure', (req, res) => {
//   console.log('Nueva failure');
//   res.render('payment-failure');
// });
//#endregion

//#region OAuth
app.get('/commerce-oauth', (req, res) => {
  console.log('Oauth');
  res.render('commerce-oauth', {
    appId: env.marketplace.APP_ID,
    commerceId: req.query['commerce-id']
  });
});

app.get('/commerce-oauth-redirect', (req, res) => {
  console.log('Redirect');
  console.log(req.query); // req.query.code

  let headers = {
    accept: 'application/json',
    'content-type': 'application/x-www-form-urlencoded'
  };

  let dataString = `client_id=${env.marketplace.APP_ID}&client_secret=${env.marketplace.SECRET_KEY}&grant_type=authorization_code&code=${req.query.code}&redirect_uri=https%3A%2F%2Fproyecto-turnosya.web.app%2Fcommerce-oauth-redirect%3Fcommerce-id%3D${req.query['commerce-id']}`;

  let options = {
    url: 'https://api.mercadopago.com/oauth/token',
    method: 'POST',
    headers: headers,
    body: dataString
  };

  request(options, (error, response, body) => {
    const db = admin.firestore();
    console.log(error);
    console.log(response.statusCode);
    if (!error && response.statusCode == 200) {
      console.log(body);
      let data = JSON.parse(body);

      const batch = db.batch();

      const commerceRef = db.doc(`Commerces/${req.query['commerce-id']}`);
      const mPagoTokenRef = db.doc(`Commerces/${req.query['commerce-id']}/MercadoPagoTokens/${data.access_token}`);

      batch.update(commerceRef, { mPagoUserId: data.user_id });

      batch.set(mPagoTokenRef, {
        publicKey: data.public_key,
        refreshToken: data.refresh_token,
        userId: data.user_id, // creo que no va a hacer falta
        expirationDate: new Date(moment().add('seconds', data.expires_in)),
        softDelete: null
      });

      batch
        .commit()
        .then(() => {
          console.log('Guardado en Firestore');
          res.render('commerce-oauth-redirect');
        })
        .catch(err => {
          console.log('Firestore error: ' + err);
          res.render('error');
        });
    } else {
      res.render('error');
    }
  });
});
//#endregion

//#region Notifications
app.post('/ipn-notification', (req, res) => {
  console.log('Nueva notificacion');
  console.log(req.body);
  // { action: 'payment.created',
  // api_version: 'v1',
  // data: { id: '5805048310' },
  // date_created: '2020-01-21T20:39:07Z',
  // id: 5550615951,
  // live_mode: true,
  // type: 'payment',
  // user_id: '515244502' }
  console.log(req.query);
  // { 'data.id': '5808660474', type: 'payment' }

  if (req.query.topic === 'payment') {
    const db = admin.firestore();

    request(
      `https://api.mercadopago.com/v1/payments/${req.query.id}?access_token=${env.marketplace.ACCESS_TOKEN}`,
      (error, response, body) => {
        console.log(error);
        console.log(response.statusCode);

        if (!error && response.statusCode == 200) {
          console.log(body);

          const { id, collector, order, payer, payment_type_id, status, external_reference } = JSON.parse(body);
          const { clientId, reservationId, commerceId } = JSON.parse(external_reference);
          console.log(external_reference);

          if (status === 'approved') {
            const paymentRef = db.collection(`Commerces/${commerceId}/Payments`).doc(id.toString());
            const commerceReservationRef = db.collection(`Commerces/${commerceId}/Reservations`).doc(reservationId);
            const clientReservationRef = db.collection(`Profiles/${clientId}/Reservations`).doc(reservationId);

            const batch = db.batch();

            batch.set(paymentRef, {
              clientId,
              reservationId,
              date: new Date(),
              collectorId: collector.id,
              method: constants.paymentTypes[payment_type_id],
              order,
              payer
            });

            batch.update(commerceReservationRef, { paymentDate: new Date() });
            batch.update(clientReservationRef, { paymentDate: new Date() });

            batch
              .commit()
              .then(() => {
                console.log('Guardado Firestore');
                res.status(200).send('API de Notificación recibida');
              })
              .catch(err => console.error('Firestore error: ' + err));
          }
        }
      }
    );
  }
});
//#endregion

exports.app = functions.https.onRequest(app);
