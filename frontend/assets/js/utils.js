/**
 * Get the JWT from localStorage and decode its payload.
 * @returns {object|null} Decoded token payload or null if invalid.
 */
export function getDecodedToken() {
  const token = localStorage.getItem("token");
  if (!token) {
      console.warn("No token found in localStorage");
      return null;
  }

  try {
      // Split the JWT into its components: Header, Payload, and Signature
      const [, payload] = token.split(".");

      if (!payload) {
          console.error("Invalid token format");
          return null;
      }

      // Decode the payload (Base64URL decoding)
      const decodedPayload = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));

      return decodedPayload;
  } catch (error) {
      console.error("Error decoding token:", error.message);
      return null;
  }
}

/**
* Check if the JWT is expired.
* @returns {boolean} True if the token is expired, false otherwise.
*/
export function isTokenExpired() {
  const decoded = getDecodedToken();
  if (!decoded || !decoded.exp) {
      return true; // Treat as expired if token is invalid or missing `exp`.
  }

  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  return currentTime > decoded.exp;
}

export function logout() {
  localStorage.removeItem("token");
  location.href = "./index.html";
}