require('dotenv').config();
const AivenApi = require('./main.js');

const print = (promise) => promise.then((content) => console.log(content));

const token = process.env.AVN_TOKEN;
const projectId = process.env.AVN_PROJECT;
const serviceName = process.env.AVN_SERVICE;
const avn = new AivenApi({ projectId, token });
print(avn.me());
print(avn.projects.list());
print(avn.services.list());
// print(avn.services.details(serviceName));
// print(avn.services.powerOn(serviceName));
// print(avn.services.powerOff(serviceName));
// print(avn.getKafkaCreds(serviceName));

// print(avn.clouds());
// print(avn.pricing());
// avn.pricing().then((pricing) => console.log(pricing.cassandra.plans[0]));
