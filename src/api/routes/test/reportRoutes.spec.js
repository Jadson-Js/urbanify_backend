import supertest from "supertest";
import app from "../../app.js";

console.clear();

const environment = {
  filePath: "/home/magnus/Pictures/baki.jpg",

  users: {
    user1: {
      email: "vakeiro20051965@gmail.com",
      password: "admin123",
      access:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZha2Vpcm8yMDA1MTk2NUBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJhY3RpdmUiOnRydWUsImlhdCI6MTc0MTUzODYzMywiZXhwIjoxNzQ0MTMwNjMzfQ.YXDOWK8e634NvbDXJ2pa_PgqYw_Z9s5mjhq_MQbx4xU",
    },
    user2: {
      email: "wisdombigrobotcompany@gmail.com",
      password: "admin123",
      access:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Indpc2RvbWJpZ3JvYm90Y29tcGFueUBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImFjdGl2ZSI6dHJ1ZSwiaWF0IjoxNzQxNTM4NjA2LCJleHAiOjE3NDQxMzA2MDZ9.yS7N_FrZp6eMfCxXqylTYYHZKoUSZe_PzX9IcfSvDjA",
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
  test("Criar report 11 com user 2", async () => {
    const response = await supertest(app)
      .post("/report")
      .set("Authorization", environment.users.user2.access)
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
  test("Criar report 20 com user 2", async () => {
    const response = await supertest(app)
      .post("/report")
      .set("Authorization", environment.users.user2.access)
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
        `/report/address/${environment.keys.report10.address}/geohash/${environment.keys.report10.geohash}`
      )
      .set("Authorization", environment.users.user1.access)
      .send({ status: 1 });

    console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.report).toHaveProperty("id");
    expect(response.body.report).toHaveProperty("address");
    expect(response.body.report).toHaveProperty("geohash");
  });

  // Expect 200, message, report: id, address, geohash, status 2
  test("Editar report 20 com user 1 status 2", async () => {
    const response = await supertest(app)
      .patch(
        `/report/address/${environment.keys.report20.address}/geohash/${environment.keys.report20.geohash}`
      )
      .set("Authorization", environment.users.user1.access)
      .send({ status: 2 });

    console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.report).toHaveProperty("id");
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
    expect(response.body.reports.length).toBe(1);
    expect(response.body.reports[0].childrens).toBeInstanceOf(Array);
    expect(response.body.reports[0].childrens.length).toBe(2);
  });

  // expect 200, message, data com report = childrens com 2 items + urls = com 2 items
  test("Buscar report 10 com user 1", async () => {
    const response = await supertest(app)
      .get(
        `/report/address/${environment.keys.report10.address}/geohash/${environment.keys.report10.geohash}`
      )
      .set("Authorization", environment.users.user1.access);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.data.report.childrens).toBeInstanceOf(Array);
    expect(response.body.data.report.childrens.length).toBe(2);
    expect(response.body.data.urls).toBeInstanceOf(Array);
    expect(response.body.data.urls.length).toBe(2);
  });

  //Expect 200, message, reports = 1 item
  test("Buscar my reports com user 1", async () => {
    const response = await supertest(app)
      .get(`/report/my`)
      .set("Authorization", environment.users.user1.access);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.reports).toBeInstanceOf(Array);
    expect(response.body.reports.length).toBe(1);
  });

  // Expect 200, message, status = 1
  test("Buscar status report 10 com user 1", async () => {
    const response = await supertest(app)
      .get(
        `/report/status/address/${environment.keys.report10.address}/geohash/${environment.keys.report10.geohash}`
      )
      .set("Authorization", environment.users.user1.access);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.status).toBe(1);
  });

  test("Deletar report 10 com user 1", async () => {
    const response = await supertest(app)
      .delete(
        `/report/address/${environment.keys.report10.address}/geohash/${environment.keys.report10.geohash}`
      )
      .set("Authorization", environment.users.user1.access);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.report).toHaveProperty("id");
    expect(response.body.report).toHaveProperty("address");
    expect(response.body.report).toHaveProperty("geohash");
  });

  test("Deletar report 10 com user 2", async () => {
    const response = await supertest(app)
      .delete(
        `/report/address/${environment.keys.report10.address}/geohash/${environment.keys.report10.geohash}`
      )
      .set("Authorization", environment.users.user2.access);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.report).toHaveProperty("id");
    expect(response.body.report).toHaveProperty("address");
    expect(response.body.report).toHaveProperty("geohash");
  });
});
