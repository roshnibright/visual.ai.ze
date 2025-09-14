// Determine API URL based on environment
const getAPIURL = () => {
  // In development, use localhost
  if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
    return "http://localhost:8000";
  }

  // In production, use the same host as the current page
  return window.location.origin;
};

const predictChar = async (text) => {
  const response = await fetch(`${getAPIURL()}/predict-char`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();
  console.log("Character Predictions:", data);
};

predictChar("The cat is sitt");
