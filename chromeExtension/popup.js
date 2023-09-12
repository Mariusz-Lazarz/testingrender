document.getElementById("fetchButton").addEventListener("click", async () => {
  const domain = document.getElementById("domainInput").value;

  if (!domain) return;

  try {
    const response = await fetch(
      `http://localhost:3000/cname?domain=${domain}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    document.getElementById("result").innerText =
      data.cname || "Error fetching CNAME.";
  } catch (error) {
    document.getElementById("result").innerText = "Error fetching CNAME.";
  }
});
