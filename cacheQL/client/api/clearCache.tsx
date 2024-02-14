export default async function clearCache() {
  console.log("clearing cache");

  const request: RequestInfo = new Request("http://localhost:5001/clearCache", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  await fetch(request)
    .then(() => {
      // alert("Cache cleared");
    })
    .catch((error) => {
      console.error({ error: `Error in setting cache` });
    });
}
