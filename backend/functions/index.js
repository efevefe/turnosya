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
  console.log('Payment');
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
    .then(mpagoResp => {
      res.render('pay', {
        init_point: mpagoResp.body.init_point,
        sandbox_init_point: mpagoResp.body.sandbox_init_point
      });
    })
    .catch(error => console.error(error));
});
//#endregion

//#region OAuth
app.get('/commerce-oauth', (req, res) => {
  console.log('OAuth');
  res.render('commerce-oauth', {
    appId: env.marketplace.APP_ID,
    commerceId: req.query['commerce-id']
  });
});

app.get('/commerce-oauth-redirect', (req, res) => {
  console.log('OAuth Redirect');
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

    if (!error && response.statusCode == 200) {
      let data = JSON.parse(body);

      const batch = db.batch();

      const mPagoTokenRef = db.doc(`Commerces/${req.query['commerce-id']}/MercadoPagoTokens/${data.access_token}`);

      batch.set(mPagoTokenRef, {
        publicKey: data.public_key,
        refreshToken: data.refresh_token,
        userId: data.user_id,
        expirationDate: new Date(moment().add('seconds', data.expires_in)),
        softDelete: null
      });

      batch
        .commit()
        .then(() => {
          res.render('commerce-oauth-redirect');
        })
        .catch(err => {
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
  console.log('Notification');
  if (req.query.topic === 'payment') {
    const db = admin.firestore();

    request(
      `https://api.mercadopago.com/v1/payments/${req.query.id}?access_token=${env.marketplace.ACCESS_TOKEN}`,
      (error, response, body) => {
        if (!error && response.statusCode == 200) {
          const { id, collector, order, payer_id, payment_type_id, status, external_reference } = JSON.parse(body);
          const { clientId, reservationId, commerceId } = JSON.parse(external_reference);

          if (status === 'approved') {
            db.doc('ReservationStates/paid')
              .get()
              .then(state => {
                const stateObject = { id: state.id, name: state.data().name };

                const paymentRef = db.collection(`Commerces/${commerceId}/Payments`).doc(id.toString());
                const commerceReservationRef = db.collection(`Commerces/${commerceId}/Reservations`).doc(reservationId);
                const clientReservationRef = db.collection(`Profiles/${clientId}/Reservations`).doc(reservationId);

                const batch = db.batch();

                batch.set(paymentRef, {
                  date: new Date(),
                  collectorId: collector.id,
                  method: constants.paymentTypes[payment_type_id],
                  order,
                  payerId: payer_id
                });

                batch.update(commerceReservationRef, { paymentId: id.toString(), state: stateObject });
                batch.update(clientReservationRef, { paymentId: id.toString(), state: stateObject });

                batch
                  .commit()
                  .then(() => {
                    res.status(200).send('Notification successfully processed');
                  })
                  .catch(err => {
                    res.status(500).send();
                  });
              })
              .catch(err => {
                console.log(err);
                res.status(500).send();
              });
          }
        }
      }
    );
  } else {
    res.status(200).send('Notification not required');
  }
});
//#endregion

// charts
app.get('/daily-reservations-chart', (req, res) => {
  res.render('daily-reservations-chart');
});

app.get('/most-popular-shifts-chart', (req, res) => {
  res.render('most-popular-shifts-chart');
});

app.get('/monthly-earnings-chart', (req, res) => {
  res.render('monthly-earnings-chart');
});

app.get('/monthly-reviews-chart', (req, res) => {
  res.render('monthly-reviews-chart');
});

app.get('/reserved-and-cancelled-chart', (req, res) => {
  res.render('reserved-and-cancelled-chart');
});
// charts end

exports.app = functions.https.onRequest(app);
