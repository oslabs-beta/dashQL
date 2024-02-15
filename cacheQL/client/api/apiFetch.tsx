interface Querystr {
  query: string;
}

interface QueryResponse {
  res: any,
  time: number,
  cacheHit: boolean,
}

export default async function getData(finalQuery: Querystr): Promise<QueryResponse> {
  console.log("------in fetch---------");

  const request:any = new Request("http://localhost:5001/dashQL", {
    method: "POST",
    body: JSON.stringify(finalQuery),
    headers: { "Content-Type": "application/json" },
  });

  const result:QueryResponse = await fetch(request)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log('got data', data)
      return data;
    })
    .catch((error) => {
      console.error({ error: `Error in fetching query data` });
    });
  return result;
}
