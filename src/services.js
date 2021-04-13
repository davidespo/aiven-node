const _ = require('lodash');

const stripService = (s) =>
  _.pick(s, [
    'cloud_name',
    'cloud_description',
    'connection_info',
    'plan',
    'service_name',
    'service_type',
    'service_uri',
    'state',
    'termination_protection',
  ]);

const asServices = (projectId, call) => ({
  list: () =>
    call(
      `https://api.aiven.io/v1/project/${projectId}/service`,
      'services',
    ).then((services) => services.map(stripService)),
  details: (id) =>
    call(
      `https://api.aiven.io/v1/project/${projectId}/service/${id}`,
      'service',
    ).then(stripService),
  powerOff: (id) =>
    call(
      `https://api.aiven.io/v1/project/${projectId}/service/${id}`,
      null,
      PUT,
      { powered: false },
    ).then(stripService),
  powerOn: (id) =>
    call(
      `https://api.aiven.io/v1/project/${projectId}/service/${id}`,
      null,
      PUT,
      { powered: true },
    ).then(stripService),
  remove: (id) =>
    call(
      `https://api.aiven.io/v1/project/${projectId}/service/${id}`,
      null,
      DELETE,
    ).then(stripService),
});

module.exports = {
  //   stripService,
  asServices,
};
