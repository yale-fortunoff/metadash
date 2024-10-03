/**
 * subjects interface - create an API interface for subjects items
 */
const createReferenceInterface = require("./createReferenceInterface");

const data = require("./json/Subjects.json").map((a) => {
  const ret = {
    label: a.title,
    id: a.uri,
  };
  return ret;
});

module.exports = createReferenceInterface(data, "subject_refs");
