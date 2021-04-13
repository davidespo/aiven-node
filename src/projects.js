const _ = require('lodash');

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

module.exports = {
  // stripProject,
  asProjects,
};
