export const useLocalStorage = () => {
  const setItems = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const removeItems = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return { setItems, removeItems };
};
