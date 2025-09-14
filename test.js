const predictChar = async (text) => {
    const response = await fetch("http://localhost:8000/predict-char", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    const data = await response.json();
    console.log("Character Predictions:", data);
  };

  predictChar("The cat is sitt");
