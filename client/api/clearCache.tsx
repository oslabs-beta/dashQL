export default async function clearCache() {
  const request: RequestInfo = new Request(
    "https://dash-ql-backend.vercel.app/clearCache",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  await fetch(request)
    .then(() => {})
    .catch((error) => {
      console.log(error, "error in clearing cache");
    });
}
