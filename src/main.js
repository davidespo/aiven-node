const _ = require('lodash');
const axios = require('axios');

const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const DELETE = 'DELETE';
const r = (token) => (url, dataPath = '', method = GET, data) =>
  axios({
    url,
    method,
    data,
    headers: { authorization: `aivenv1 ${token}` },
  })
    .then((res) => _.get(res, !!dataPath ? `data.${dataPath}` : 'data'))
    .catch((err) => console.error(err, { url, method, data }));

const stripProject = (p) =>
  _.pick(p, [
    'account_id',
    'account_name',
    'available_credits',
    'default_cloud',
    'project_name',
    'estimated_balanace',
  ]);

const asProjects = (call) => ({
  list: () =>
    call('https://api.aiven.io/v1/project').then(
      ({ project_memberships, projects }) => ({
        projects: projects.map(stripProject),
        project_memberships,
      }),
    ),
  details: (id) => call(`https://api.aiven.io/v1/project/${id}`, 'project'),
  ca: (id) =>
    call(`https://api.aiven.io/v1/project/${id}/kms/ca`, 'certificate'),
});

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

const check = (value, message = 'Missing value') => {
  if (!value) {
    throw new Error(message);
  }
  return value;
};

class AivenApi {
  constructor({ projectId = null, token }) {
    this.projectId = projectId;
    this.token = token;
    const call = (this.call = r(token));
    this.projects = asProjects(call);
    if (!!projectId) {
      this.services = asServices(projectId, call);
    }
  }
  setProject(projectId) {
    this.projectId = projectId;
    if (!!projectId) {
      this.services = asServices(projectId, call);
    }
  }
  clouds() {
    return this.call('https://api.aiven.io/v1/clouds', 'clouds');
  }
  async pricing() {
    const services = await this.call(
      'https://api.aiven.io/v1/service_types',
      'service_types',
    );
    Object.values(services).forEach((service) => {
      delete service.user_config_schema;
      service.plans = service.service_plans.map((plan) => {
        delete plan.backup_config;
        delete plan.service_type;
        return plan;
      });
      delete service.service_plans;
    });
    return services;
  }
  async getKafkaCreds(serviceName) {
    const ca = check(
      await this.projects.ca(this.projectId),
      `Project not set, or project with name "${this.projectId}" not found`,
    );
    const service = check(
      await this.services.details(serviceName),
      `Service with name "${serviceName}" not found`,
    );
    const { connection_info, service_uri: kafkaUri, service_type } = service;
    // TODO: SASL
    check(
      service_type === 'kafka',
      `Service with name "${serviceName}" not type kafka. Instead was of type="${service_type}"`,
    );
    return {
      conn: {
        brokers: [kafkaUri],
        ssl: {
          rejectUnauthorized: false,
          ca: [ca],
          cert: connection_info.kafka_access_cert,
          key: connection_info.kafka_access_key,
        },
      },
      kafkaUri,
      connectUri: connection_info.kafka_connect_uri,
      kafkaRestUri: connection_info.kafka_rest_uri,
      schemaRegistryUri: connection_info.schema_registry_uri,
    };
  }
  async getElasticsearchCreds(serviceName) {
    const service = check(
      await this.services.details(serviceName),
      `Service with name "${serviceName}" not found`,
    );
    const { connection_info, service_uri: esUri, service_type } = service;
    const {
      elasticsearch_password: password,
      elasticsearch_username: username,
      kibana_uri: kibanaUri,
    } = connection_info;
    check(
      service_type === 'elasticsearch',
      `Service with name "${serviceName}" not type elasticsearch. Instead was of type="${service_type}"`,
    );
    return {
      baseReq: {
        url: esUri,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
      username,
      password,
      esUri,
      kibanaUri,
    };
  }
  me() {
    return this.call('https://api.aiven.io/v1/me', 'user');
  }
}

module.exports = AivenApi;
