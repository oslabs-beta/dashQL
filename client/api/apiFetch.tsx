interface Querystr {
  query: string;
}

interface QueryResponse {
  res: any;
  time: number;
  cacheHit: boolean;
}

export default async function getData(
  finalQuery: Querystr
): Promise<QueryResponse> {
  const request: any = new Request(
    "https://dash-ql-backend.vercel.app/dashQL",
    {
      method: "POST",
      body: JSON.stringify(finalQuery),
      headers: { "Content-Type": "application/json" },
    }
  );

  const result: QueryResponse = await fetch(request)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error, "error in fetching data");
    });
  return result;
}
