module.exports = {
  parserOpts: {
    headerPattern: /^(\w*)(?:\((\w*)\))?: ((?:Revert )?(?:NO-JIRA|[A-Z]{2,}-\d+)(?: [A-Z]{2,}-\d+)*) (.+)$/,
    headerCorrespondence: ['type', 'scope', 'jira', 'subject'],
  },
};
