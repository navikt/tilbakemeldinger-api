const setSanityPermissions = client => {
  const editor = {
    _id: "_.groups.editor",
    _type: "system.group",
    grants: [
      {
        filter: "_type == 'alert'",
        permissions: ["read", "create", "update", "manage"]
      },
      {
        filter: "_type == 'channel'",
        permissions: ["read", "create", "update"]
      },
      {
        filter: "_type == 'theme'",
        permissions: ["read", "create", "update"]
      },
      {
        filter: "_type == 'faq'",
        permissions: ["read", "create", "update", "manage"]
      }
    ],
    members: ["pCYiiOgGd"]
  };

  client
    .createOrReplace(editor)
    .then(result => result)
    .catch(error => console.error(error));
};

const setSanityChannels = client => {
  const channels = [
    { _id: "chat", _type: "channel" },
    { _id: "write", _type: "channel" },
    { _id: "telephone", _type: "channel" },
    { _id: "tutor", _type: "channel" }
  ];

  channels.map(channel =>
    client
      .createIfNotExists(channel)
      .then(result => result)
      .catch(error => console.error(error))
  );
};

const setSanityThemes = async client => {
  // Fetch existing channels
  const query = "*[_type == 'channel' && !(_id in path('drafts.**'))] {...}";
  const curChannels = await client
    .fetch(query)
    .then(result => result)
    .catch(error => console.error(error));

  // Base channels
  const baseChannels = [
    {
      _id: "chat",
      themes: [
        { _key: "arbeidsgiver", _type: "theme" },
        { _key: "jobbsoker", _type: "theme" },
        { _key: "syk", _type: "theme" },
        { _key: "familie", _type: "theme" },
        { _key: "ufor", _type: "theme" },
        { _key: "sosialhjelp", _type: "theme" },
        { _key: "okonomi", _type: "theme" },
        { _key: "eures", _type: "theme" }
      ]
    },
    {
      _id: "write",
      themes: [
        { _key: "jobbsoker", _type: "theme" },
        { _key: "syk", _type: "theme" },
        { _key: "familie", _type: "theme" },
        { _key: "ufor", _type: "theme" },
        { _key: "pensjonist", _type: "theme" },
        { _key: "hjelpemidler", _type: "theme" }
      ]
    }
  ];

  // Compare arrays
  baseChannels.forEach(baseChannel => {
    const baseThemes = baseChannel.themes || [];
    const curThemes =
      curChannels.find(curChannel => curChannel._id === baseChannel._id)
        .themes || [];

    // Filter out existing themes
    const addThemes = baseThemes.filter(baseTheme => {
      let add = true;
      curThemes.forEach(curTheme => {
        if (curTheme._id === baseTheme._id) {
          add = false;
        }
      });
      return add;
    });

    // Insert base themes
    // that doesnt already exists
    client
      .patch(baseChannel._id)
      .setIfMissing({ themes: [] })
      .set({ themes: [...curThemes, ...addThemes] })
      .commit()
      .then(result => result)
      .catch(error => console.error(error));
  });
};

module.exports = {
  setSanityChannels,
  setSanityThemes,
  setSanityPermissions
};
