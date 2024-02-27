import getData from "../../../client/api/apiFetch";

// mock for being able to render nav page
interface QueryResponse {
  res: any;
  time: number;
  cacheHit: boolean;
}

describe("API Fetch Test", () => {
  let result: any = {
    peopleRes: null,
    planetsRes: null,
    nestedRes: null,
    peopleNoId: null,
    planetsNoId: null,
  };
  beforeEach(async () => {
    const pplStr = "query {people (_id:1){name, mass, ,  ,   }}";
    result.peopleRes = await getData({ query: pplStr });
    const planetStr = "query {planets (_id:1){name, population, ,  ,   }}";
    result.planetsRes = await getData({ query: planetStr });
    const nestedStr = "query {people (_id:1){name, , , species { name,  } }}";
    result.nestedRes = await getData({ query: nestedStr });
    const peopleNoIdStr = "{peopleNoId {name, , ,  ,   }}";
    result.peopleNoId = await getData({ query: peopleNoIdStr });
    const planetsNoIdStr = "{planetsNoId {name, , ,  ,   }}";
    result.planetsNoId = await getData({ query: planetsNoIdStr });
  });
  test("Testing fetch to /dashQl endpoint for people schema with id", async () => {
    // tests
    expect(result.peopleRes.res).toStrictEqual(
      '{"data":{"people":{"name":"Luke Skywalker","mass":77}}}'
    );
    expect(result.peopleRes).toHaveProperty("res");
    expect(result.peopleRes).toHaveProperty("cacheHit");
    expect(result.peopleRes).toHaveProperty("hitPercentage");
    expect(result.peopleRes).toHaveProperty("missPercentage");
    expect(result.peopleRes).toHaveProperty("time");
    expect(result.peopleRes).toHaveProperty("totalHits");
    expect(result.peopleRes).toHaveProperty("totalQueries");
  });

  test("Testing fetch to /dashQl endpoint for planets schema with id", async () => {
    // tests
    expect(result.planetsRes.res).toStrictEqual(
      '{"data":{"planets":{"name":"Tatooine","population":200000}}}'
    );
    expect(result.planetsRes).toHaveProperty("res");
    expect(result.planetsRes).toHaveProperty("cacheHit");
    expect(result.planetsRes).toHaveProperty("hitPercentage");
    expect(result.planetsRes).toHaveProperty("missPercentage");
    expect(result.planetsRes).toHaveProperty("time");
    expect(result.planetsRes).toHaveProperty("totalHits");
    expect(result.planetsRes).toHaveProperty("totalQueries");
  });

  test("Testing fetch to /dashQl endpoint for nested people schema with id", async () => {
    // tests
    expect(result.nestedRes.res).toStrictEqual(
      '{"data":{"people":{"name":"Luke Skywalker","species":{"name":"Human"}}}}'
    );
    expect(result.nestedRes).toHaveProperty("res");
    expect(result.nestedRes).toHaveProperty("cacheHit");
    expect(result.nestedRes).toHaveProperty("hitPercentage");
    expect(result.nestedRes).toHaveProperty("missPercentage");
    expect(result.nestedRes).toHaveProperty("time");
    expect(result.nestedRes).toHaveProperty("totalHits");
    expect(result.nestedRes).toHaveProperty("totalQueries");
  });

  test("Testing fetch to /dashQl endpoint for  people schema with NO id", async () => {
    // tests
    const parsedRes = await JSON.parse(result.peopleNoId.res);
    const expectedRes = [];
    for (let dataPoint of parsedRes.data.peopleNoId.name) {
      if (expectedRes.length >= 10) {
        break;
      }
      expectedRes.push(dataPoint);
    }

    expect(expectedRes).toStrictEqual([
      "Luke Skywalker",
      "C-3PO",
      "R2-D2",
      "Darth Vader",
      "Leia Organa",
      "Owen Lars",
      "Beru Whitesun lars",
      "R5-D4",
      "Biggs Darklighter",
      "Obi-Wan Kenobi",
    ]);
    expect(result.peopleNoId).toHaveProperty("res");
    expect(result.peopleNoId).toHaveProperty("cacheHit");
    expect(result.peopleNoId).toHaveProperty("hitPercentage");
    expect(result.peopleNoId).toHaveProperty("missPercentage");
    expect(result.peopleNoId).toHaveProperty("time");
    expect(result.peopleNoId).toHaveProperty("totalHits");
    expect(result.peopleNoId).toHaveProperty("totalQueries");
  });

  test("Testing fetch to /dashQl endpoint for  planets schema with NO id", async () => {
    const parsedRes = await JSON.parse(result.planetsNoId.res);
    const expectedRes = [];
    for (let dataPoint of parsedRes.data.planetsNoId.name) {
      if (expectedRes.length >= 10) {
        break;
      }
      expectedRes.push(dataPoint);
    }

    expect(expectedRes).toStrictEqual([
      "Alderaan",
      "Yavin IV",
      "Hoth",
      "Dagobah",
      "Bespin",
      "Endor",
      "Naboo",
      "Coruscant",
      "Kamino",
      "Geonosis",
    ]);
    expect(result.planetsNoId).toHaveProperty("res");
    expect(result.planetsNoId).toHaveProperty("cacheHit");
    expect(result.planetsNoId).toHaveProperty("hitPercentage");
    expect(result.planetsNoId).toHaveProperty("missPercentage");
    expect(result.planetsNoId).toHaveProperty("time");
    expect(result.planetsNoId).toHaveProperty("totalHits");
    expect(result.planetsNoId).toHaveProperty("totalQueries");
  });
});
