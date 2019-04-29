const axios = require('axios');

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const app = admin.initializeApp();

console.log(app.options_)

const config = functions.config().config
const apiKey = config.api_key || app.options_.apiKey || process.env.API_KEY;
const firebaseDynamicLinkApi = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`;
const domainUriPrefix = config.domain_uri_prefix || 'https://duyeturl.page.link';

exports.addUrl = functions.https.onRequest(async (req, res) => {
    const link = req.query.url || req.body.url || null;

    try {
        let result = await axios.post(firebaseDynamicLinkApi, {
            dynamicLinkInfo: {
                domainUriPrefix,
                link,
            },
            suffix: {
                option: 'SHORT'
            }
        })

        res.json(result.data)
    } catch (e) {
        console.error(e.message)
        res.status(500).json('error')
    }
});