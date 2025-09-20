const API_URL = import.meta.env.VITE_API_URL;

export async function fetchWithAuth(endpoint, options = {}) {
  let accessToken = localStorage.getItem("accessToken");

  // attach access token
  options.headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
  options.credentials = "include"; // send cookies (refresh token)

  let res = await fetch(`${API_URL}${endpoint}`, options);

  // if access token expired, try refresh
  if (res.status === 401) {
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", // send refresh cookie
    });

    if (refreshRes.ok) {
      const { accessToken: newToken } = await refreshRes.json();
      localStorage.setItem("accessToken", newToken);

      // retry original request with new token
      options.headers.Authorization = `Bearer ${newToken}`;
      res = await fetch(`${API_URL}${endpoint}`, options);
    } else {
      // refresh failed → clear and redirect
      localStorage.clear();
      window.location.href = "/login";
    }
  }

  return res;
}
