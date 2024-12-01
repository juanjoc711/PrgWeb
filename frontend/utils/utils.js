  
  
  let token = "";

  export function setToken(newToken) {
    token = newToken;
  }
  
  export function getToken() {
    return token;
  }
  
  export function switchView(viewId) {
    const views = ["login", "register", "associations-view", "account-management", "my-associations-view"];
    views.forEach((id) => {
      document.getElementById(id).style.display = id === viewId ? "block" : "none";
    });
  }
  
