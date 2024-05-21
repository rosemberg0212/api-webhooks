const { mondayApi } = require("../apis");

const getInfoMonday = async ({ boardId, pulseId }) => {
  const query = `query  { boards  (ids: ${boardId}) { items_page (query_params: {ids: ${pulseId}}) { items { id name column_values { id text }}}}}`;

  const { data } = await mondayApi.post("/", {
    query,
  });

  return { data:data.data.boards[0].items_page.items[0] };
};

module.exports = {
  getInfoMonday,
};
