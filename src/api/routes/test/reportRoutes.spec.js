import supertest from "supertest";
import app from "../../app.js";

console.clear();

const environment = {
  filePath: "/home/magnus/Pictures/Yugiro.jpg",

  users: {
    user1: {
      email: "admin@admin.com",
      password: "admin123",
      access:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInJvbGUiOiJBRE1JTiIsImFjdGl2ZSI6dHJ1ZSwiaWF0IjoxNzQ1MjYyMzA1LCJleHAiOjE3NDc4NTQzMDV9.2hti2fhWs4TJSe7BTbQTnKNVOpt8h-nKUKmMhSUfyo8",
    },
    user2: {
      email: "jadson20051965@gmail.com",
      password: "admin123",
      access:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphZHNvbjIwMDUxOTY1QGdtYWlsLmNvbSIsInJvbGUiOiJFTkdJTkVFUiIsImFjdGl2ZSI6dHJ1ZSwiaWF0IjoxNzQ1MjYyMzM1LCJleHAiOjE3NDc4NTQzMzV9.IrPtqSPggWilr00pZA33F1o-26VE3YTLWD1rxFaAagk",
    },
    user3: {
      email: "vakeiro20051965@gmail.com",
      password: "admin123",
      access:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZha2Vpcm8yMDA1MTk2NUBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImFjdGl2ZSI6dHJ1ZSwiaWF0IjoxNzQ1MjYyMzUzLCJleHAiOjE3NDc4NTQzNTN9._aUCceYU1HCz1_8lr6hhjGg9wuFa6TK2fPxCsUMg7Yc",
    },
  },

  reports: {
    report10: `{  "subregion": "São Luís",  "district": "Liberdade",  "street": "Rua Machado De Assis",  "severity": "MODERADO",  "coordinates": {    "latitude": "-2.5326829319191773",    "longitude": "-44.28404809576579"  }}`,

    report11: `{  "subregion": "São Luís",  "district": "Liberdade",  "street": "Rua Machado De Assis",  "severity": "GRAVE",  "coordinates": {    "latitude": "-2.532888103097746",    "longitude": "-44.28406521008228"  }}`,

    report20: `{  "subregion": "São Luís",  "district": "Monte Castelo",  "street": "Rua Paulo Fontin",  "severity": "MODERADO",  "coordinates": {    "latitude": "-2.539193470011821",    "longitude": "-44.28389473683467"  }}`,
  },

  keys: {
    report10: { address: "São Luís_Liberdade", geohash: "7p8986c" },
    report20: { address: "São Luís_Monte Castelo", geohash: "7p8983c" },
  },
};

describe("Report Routes", () => {
  test("Criar report 10 com user 1", async () => {
    const response = await supertest(app)
      .post("/report")
      .set("Authorization", environment.users.user1.access)
      .field("data", environment.reports.report10)
      .attach("file", environment.filePath);

    console.log(response.body);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message");
    expect(response.body.report).toHaveProperty("id");
    expect(response.body.report).toHaveProperty("address");
    expect(response.body.report).toHaveProperty("geohash");
  });

  // Expect 201, message e report: id, address, geohash
  test("Criar report 11 com user 3", async () => {
    const response = await supertest(app)
      .post("/report")
      .set("Authorization", environment.users.user3.access)
      .field("data", environment.reports.report11)
      .attach("file", environment.filePath);

    console.log(response.body);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message");
    expect(response.body.report).toHaveProperty("id");
    expect(response.body.report).toHaveProperty("address");
    expect(response.body.report).toHaveProperty("geohash");
  });

  // Expect 201, message e report: id, address, geohash
  test("Criar report 20 com user 3", async () => {
    const response = await supertest(app)
      .post("/report")
      .set("Authorization", environment.users.user3.access)
      .field("data", environment.reports.report20)
      .attach("file", environment.filePath);

    console.log(response.body);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message");
    expect(response.body.report).toHaveProperty("id");
    expect(response.body.report).toHaveProperty("address");
    expect(response.body.report).toHaveProperty("geohash");
  });

  // Expect 200, message, report: id, address, geohash, status
  test("Editar report 10 com user 1 status 1", async () => {
    const response = await supertest(app)
      .patch(
        `/report/address/${environment.keys.report10.address}/geohash/${environment.keys.report10.geohash}`,
      )
      .set("Authorization", environment.users.user1.access);

    console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.report).toHaveProperty("status");
    expect(response.body.report).toHaveProperty("address");
    expect(response.body.report).toHaveProperty("geohash");
  });

  // Expect 200, message, report: id, address, geohash, status 2
  test("Editar report 20 com user 2 status 2", async () => {
    const response = await supertest(app)
      .patch(`/report/repaired`)
      .set("Authorization", environment.users.user2.access)
      .field("data", environment.reports.report20)
      .attach("file", environment.filePath);

    console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.report).toHaveProperty("status");
    expect(response.body.report).toHaveProperty("address");
    expect(response.body.report).toHaveProperty("geohash");
  });

  // Expect 200, message, reports: array com 1 item, dentro do item no childrens outro array com 2 items
  test("Buscar todos reports com user 1 ", async () => {
    const response = await supertest(app)
      .get("/report")
      .set("Authorization", environment.users.user1.access);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.reports).toBeInstanceOf(Array);
    expect(response.body.reports[0].childrens).toBeInstanceOf(Array);
  });

  // Expect 200, message, reports: array com 1 item, dentro do item no childrens outro array com 2 items
  test("Buscar reports filtrado com user 2 ", async () => {
    const response = await supertest(app)
      .get("/report/evaluated")
      .set("Authorization", environment.users.user2.access);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.reports).toBeInstanceOf(Array);
    expect(response.body.reports[0].childrens).toBeInstanceOf(Array);
  });

  // expect 200, message, data com report = childrens com 2 items + urls = com 2 items
  test("Buscar report 10 com user 1", async () => {
    const response = await supertest(app)
      .get(
        `/report/address/${environment.keys.report10.address}/geohash/${environment.keys.report10.geohash}`,
      )
      .set("Authorization", environment.users.user1.access);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.data.report.childrens).toBeInstanceOf(Array);
    expect(response.body.data.urls).toBeInstanceOf(Array);
  });

  //Expect 200, message, reports = 1 item
  test("Buscar my reports com user 1", async () => {
    const response = await supertest(app)
      .get(`/report/my`)
      .set("Authorization", environment.users.user1.access);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.reports).toBeInstanceOf(Array);
  });

  // Expect 200, message, status = 1
  test("Buscar status report 10 com user 1", async () => {
    const response = await supertest(app)
      .get(
        `/report/status/address/${environment.keys.report10.address}/geohash/${environment.keys.report10.geohash}`,
      )
      .set("Authorization", environment.users.user1.access);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.status).toBe(1);
  });

  test("Deletar report 10 com user 1", async () => {
    const response = await supertest(app)
      .delete(
        `/report/address/${environment.keys.report10.address}/geohash/${environment.keys.report10.geohash}`,
      )
      .set("Authorization", environment.users.user1.access);

    expect(response.statusCode).toBe(204);
  });

  test("Deletar report 10 com user 3", async () => {
    const response = await supertest(app)
      .delete(
        `/report/address/${environment.keys.report10.address}/geohash/${environment.keys.report10.geohash}`,
      )
      .set("Authorization", environment.users.user3.access);

    expect(response.statusCode).toBe(204);
  });

  test("Buscar todos users com user 1", async () => {
    const response = await supertest(app)
      .get("/user")
      .set("Authorization", environment.users.user1.access);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.users).toBeInstanceOf(Array);
  });

  test("Buscar todos resolved_reports com user 1", async () => {
    const response = await supertest(app)
      .get("/resolved")
      .set("Authorization", environment.users.user1.access);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.reports).toBeInstanceOf(Array);
  });
});
