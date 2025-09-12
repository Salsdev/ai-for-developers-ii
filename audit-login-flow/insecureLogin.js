// AI-generated login function
async function login(email, password) {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    localStorage.setItem("user", JSON.stringify(data.user)); // 🚩 Token not stored securely
    return data;
  }