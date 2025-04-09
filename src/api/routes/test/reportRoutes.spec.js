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
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInJvbGUiOiJBRE1JTiIsImFjdGl2ZSI6dHJ1ZSwiaWF0IjoxNzQzNDI4ODA5LCJleHAiOjE3NDYwMjA4MDl9.P18A3nH3DH9HJ5gTIIF1Bs7sejuK8dcIKs_T7Y9oD0E",
    },
    user2: {
      email: "wisdombigrobotcompany@gmail.com",
      password: "admin123",
      access:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphZHNvbjIwMDUxOTY1QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiYWN0aXZlIjp0cnVlLCJpYXQiOjE3NDM0Mjg4MzksImV4cCI6MTc0NjAyMDgzOX0.kMVVGxyMnnUhi9Ffau_bIHwNs8L-p-09rcbCeUSzHVY",
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
      .set("Authorization", environment.users.user1.access);

    console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.report).toHaveProperty("status");
    expect(response.body.report).toHaveProperty("address");
    expect(response.body.report).toHaveProperty("geohash");
  });

  // Expect 200, message, report: id, address, geohash, status 2
  test("Editar report 20 com user 1 status 2", async () => {
    const response = await supertest(app)
      .patch(`/report/repaired`)
      .set("Authorization", environment.users.user1.access)
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

    expect(response.statusCode).toBe(204);
  });

  test("Deletar report 10 com user 2", async () => {
    const response = await supertest(app)
      .delete(
        `/report/address/${environment.keys.report10.address}/geohash/${environment.keys.report10.geohash}`
      )
      .set("Authorization", environment.users.user2.access);

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
