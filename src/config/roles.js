const allRoles = {
    user: [],
    admin: ['getUsers', 'admin','manageUsers', '_loggedUser'],
  };
  
  const roles = Object.keys(allRoles);
  const roleRights = new Map(Object.entries(allRoles));
  
  module.exports = {
    roles,
    roleRights,
  };
  