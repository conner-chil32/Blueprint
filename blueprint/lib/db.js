//test database 
export async function validateConnection() {
  return true; // always succeeds in tests
}

export default {
  query: async () => {
    // Return an empty result set
    return [[]];
  },
  commit: async () => true,
};
