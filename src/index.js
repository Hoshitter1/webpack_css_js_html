// https://github.com/auth0/auth0-spa-js

import createAuth0Client from "@auth0/auth0-spa-js";

let auth0 = null;

const fetchAuthConfig = () => fetch("/auth_config.json");

const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();
  auth0 = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
  });
};

const updateUI = async () => {
  const isAuthenticated = await auth0.isAuthenticated();
  document.getElementById("btn-logout").disabled = !isAuthenticated;
  document.getElementById("btn-login").disabled = isAuthenticated;
  if (isAuthenticated) {
    console.log("authenticated");
    // ログインしているユーザへのアクションをここに書く
  } else {
    console.log("NOT authenticated");
    // ログインしていないユーザへのアクションをここに書く
  }
};

// 更新時に毎回読み込む
window.onload = async () => {
  await configureClient();
  updateUI();
  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    // ログイン失敗時とか、変なタイミングで戻ってきたときのユーザへの対応
    // ログインを進める
    await auth0.handleRedirectCallback();
    updateUI();
    // クエリパラメータを除くためにホームにユーザをレダイレクトする
    window.history.replaceState({}, document.title, "/");
  }
};

const login = async () => {
  console.log("login clicked");
  await auth0.loginWithRedirect({
    redirect_uri: window.location.origin,
  });
};
document.getElementById("btn-login").addEventListener("click", login);

const logout = () => {
  console.log("logout clicked");
  auth0.logout({
    returnTo: window.location.origin,
  });
};
document.getElementById("btn-logout").addEventListener("click", logout);

const moveToPageA = () => {
  window.location.href = "pagea.html";
};
document.getElementById("move-page").addEventListener("click", moveToPageA);
