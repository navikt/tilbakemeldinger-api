const setSanityPermissions = client => {
  const permissions = [
    {
      _id: "_.groups.admin",
      members: ["everyone"],
      grants: [
        {
          filter: "_type == 'alert'",
          permissions: ["read", "create", "update", "manage"]
        },
        {
          filter: "_type == 'channel'",
          permissions: ["read", "create", "update", "manage"]
        },
        {
          filter: "_type == 'theme'",
          permissions: ["read", "create", "update", "manage"]
        },
        {
          filter: "_type == 'faq'",
          permissions: ["read", "create", "update", "manage"]
        }
      ]
    },
    {
      _id: "_.groups.editor",
      members: ["everyone"],
      grants: [
        {
          filter: "_type == 'alert'",
          permissions: ["read", "create", "update", "manage"]
        },
        {
          filter: "_type == 'channel'",
          permissions: ["read", "create", "update", "manage"]
        },
        {
          filter: "_type == 'theme'",
          permissions: ["read", "create", "update", "manage"]
        },
        {
          filter: "_type == 'faq'",
          permissions: ["read", "create", "update", "manage"]
        }
      ]
    }
  ];

  return permissions.map(group =>
    client
      .patch(group._id)
      .set({ grants: group.grants, members: group.members })
      .commit()
      .then(result => {
        console.log(`Updated ${group._id}: ${JSON.stringify(result)}`);
      })
      .catch(error => {
        console.log(`Error ${group._id}: ${JSON.stringify(error)}`);
      })
  );
};

module.exports = {
  setSanityPermissions
};
