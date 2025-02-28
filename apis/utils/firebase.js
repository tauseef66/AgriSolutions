const admin = require('firebase-admin');
const serviceAccount = require('../utils/firebase-admin.json'); // Path to your Firebase Admin SDK JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;











// {
//   "type": "service_account",
//   "project_id": "agrisolutions-cb9f8",
//   "private_key_id": "2c58639ff892825218a567102b3547e3f34963de",
//   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCdqpiOrTe1fQKS\nc/UhxeNKS4qb4yNVDrMFgOXvRGTyoOtq0bMA5euTLA+Xljpf4YKMyL8BCGLD1Fr8\nsl9mru7+gjqKLvH/q8aPgGbdk7Z1ZiR3ijYLvOpIRIYMldwrGkaaV9VMYCktAkiq\n0EcPn1Murh9DurHF0EwzZVxBbEcmrWN59du+e8DAzquID7gyISDNfqRaXB03gRYx\nfC0RozuE9/tOmOQyILJRQguFJm+b9DOeEuECDOahUDb309S9T4YDoA42hKD4vn+i\nr77LO+ZSQA6OQx68sw/+dZnqp5X6pPKYNJH+xJLhEYOkfaHAHJB1aR7qYCRvzLne\nxilJbSu3AgMBAAECggEAAqY87EEjjwcqqlekL9Qiey0x73FAjCW48BhK6sPEtnzz\niFucZEb0DS6bsTTr7qNXrnqJFvnyD4N3/ubn0+9NVYrX3BgO5GC6yai/qXYb9+aw\nA172qpFPN7W8sbrHYb9exFlVV9ydzWcAfxQ7/9NtVb1TTEeKeJuq7VFHYW/7Paa+\nfAu7flgkbkFmJQ/ieZvb+jU/T1yRlZjmn3EpZNAlSQHoCtf4rHqqHPzlcZf4qkwM\n6i80BHHu2a3Ppc4QzpsWKlbqLltxFDDXfvdQTvPUaxiuKBdIwvcFNq5T/TFc0aM8\n74vL6T8flxjPhUqmK4iYM+E9ES54m8GhDU0IbFfy8QKBgQDdJdgN2ExSle6ovGNm\nd4a2tY6EEAkxQt8WJrZHahRgLiCWUuO1oXX0onhXsWKvyTOh0O7tkzyx6q76lnYl\niwK2yEMpTpxZNZiFl1J0lDJ/Bhl6qU2NNY9IycTTP0M2Nfaas5qmU9OnW3bsh/vG\nUUcgQKpbgewNlxG7vYhU93d/4wKBgQC2g5vNUCbUdhO7G4v8UXP5RiDZMBe1VOn1\n1l99HyrXWg9WT2hkejqgNxXd2VvxTQhZzRQdJqiX0JkKf8GAGbfjt/O3ycrUHdOe\n3GiQpiw2WfaoYNg8MySQLGB22UKaryksYwcUY9w3nVeeUdkGrg7BAmwho1AvH+li\nFB4s677FHQKBgQC7lglRnSMIfqOlv781QLglrZXJEe0qOwYOvSGrLCFCgH4l5QPA\nosfyjgo0oIQMhkfkv9yb62P1qxNn/k8Tg3n236KQnFzlEyBgWT6ZIsg+lUbxlEDz\nQfZbkMMDSctSZa3cBfNtmPeVI3GaK7L2wyTpB9E5s9guovFo5dmJ8SwNbwKBgE8j\nd+4pn/ymCl4qTqOkqfXfa6ThDpao8B2Ry6vUVN42Bcp1+hz/RuZrnEaq1gwmS8Ws\nf9k4Bwh1AbckuEGUZUEPZVU+4XziRf1vMsPt2ePjVGmkPH616le9dkJyaEfsRZ0i\nf1JfDoDq77ANa15TIMCeDUb0qnMUkjzd3ku6GOkdAoGBALcDQOHiWayBQTPU9YAw\n23lBHgMwbRZMRdroksoBDOtAC2YHbgJpffKaBX3g7P5OTtV5AQq4Y3+QCiehCjLY\n+xxbFlWnghYn9qd22I8qzHszowKGmnvWSvyPr7QdTtiq76Zn6+/sLdBF3POGY4FO\nrtWhRuLvaUHPJ/MZ1WY/D7xx\n-----END PRIVATE KEY-----\n",
//   "client_email": "firebase-adminsdk-fbsvc@agrisolutions-cb9f8.iam.gserviceaccount.com",
//   "client_id": "100975370407720314880",
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://oauth2.googleapis.com/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40agrisolutions-cb9f8.iam.gserviceaccount.com",
//   "universe_domain": "googleapis.com"
// }
