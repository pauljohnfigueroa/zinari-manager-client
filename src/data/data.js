/* Permissions that can be given to roles. */
export const permissionsValues = [
  { header: 'User Management' },
  {
    value: 'view_users_dashboard',
    description: 'View the users dashboard.'
  },
  {
    value: 'create_user',
    description: 'Create a new user.'
  },
  {
    value: 'delete_users',
    description: 'Delete user/s.'
  },
  {
    value: 'fetch_users',
    description: 'Fetch users records x.'
  },
  { header: 'Project Management' },
  {
    value: 'fetch_projects',
    description: 'Fetch projects.'
  },
  {
    value: 'update_project',
    description: 'Update or edit a project.'
  },
  { header: 'Performance' },
  {
    value: 'view_appraisals_dashboard',
    description: 'View performance appraisal dashboard.'
  },
  {
    value: 'create_appraisal',
    description: 'Create an appraisal.'
  }
]
