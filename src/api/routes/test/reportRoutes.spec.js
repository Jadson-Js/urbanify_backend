import supertest from "supertest";
import app from "../../app.js";

const req = {
  adminToken:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTczOTkwNzQ1NSwiZXhwIjoxNzQyNDk5NDU1fQ.nhqd3llOMuV7czOv0PwLUoIgukx-Bbj8rG24m2wM5n0",

  userToken:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAYWRtaW4uY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3Mzk5MDQ5MjMsImV4cCI6MTc0MjQ5NjkyM30.RVKp62l0jQ1Mq_gqv1Na1cNb7qhOM4pNr9UtdUVSUX8",

  filePath: "/home/magnus/Pictures/baki.jpg",
  report: {
    my: `{  "subregion": "São Luís",  "district": "Liberdade",  "street": "Rua Machado De Assis",  "severity": "MODERADO",  "coordinates": {    "latitude": "-2.5325999611122065",    "longitude": "-44.284021668688126"  }}`,

    neighbor: `{  "subregion": "São Luís",  "district": "Liberdade",  "street": "Rua Machado De Assis",  "severity": "GRAVE",  "coordinates": {    "latitude": "-2.5328124698162275",    "longitude": "-44.28404927311758"  }}`,

    grandma: `{  "subregion": "São Luís",  "district": "Monte Castelo",  "street": "Rua Paulo Fontin",  "severity": "MODERADO",  "coordinates": {    "latitude": "-2.539162334606275",    "longitude": "-44.28390231258721"  }}`,
  },
};

describe("Report Routes", () => {
  test("Criar um report meu como ADMIN com sucesso", async () => {
    const response = await supertest(app)
      .post("/report")
      .set("Authorization", req.adminToken)
      .field("data", req.report.my)
      .attach("file", req.filePath);

    console.log(response.body);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Report cadastrado com sucesso!"
    );
    expect(response.body.report).toHaveProperty("id");
  });

  test("Criar um report para avó como ADMIN com sucesso", async () => {
    const response = await supertest(app)
      .post("/report")
      .set("Authorization", req.adminToken)
      .field("data", req.report.grandma)
      .attach("file", req.filePath);

    console.log(response.body);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Report cadastrado com sucesso!"
    );
    expect(response.body.report).toHaveProperty("id");
  });

  test("Criar um report meu como USER com sucesso ", async () => {
    const response = await supertest(app)
      .post("/report")
      .set("Authorization", req.userToken)
      .field("data", req.report.my)
      .attach("file", req.filePath);

    console.log(response.body);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Report cadastrado com sucesso!"
    );
    expect(response.body.report).toHaveProperty("id");
  });

  test("Pega todos reports com sucesso", async () => {
    const response = await supertest(app)
      .get("/report")
      .set("Authorization", req.adminToken);

    console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.reports)).toBe(true);
    expect(response.body.reports.length).toBe(2);
  });

  test("Pega um report com sucesso", async () => {
    const response = await supertest(app)
      .get("/report/address/São Luís_Liberdade/geohash/7p8986c")
      .set("Authorization", req.adminToken);

    console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.report).toBeInstanceOf(Object);
  });

  test("Pega todos reports do ADMIN com sucesso", async () => {
    const response = await supertest(app)
      .get("/report/my")
      .set("Authorization", req.adminToken);

    console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.report)).toBe(true);
    expect(response.body.report.length).toBe(2);
  });

  test("Pega todos reports do USER com sucesso", async () => {
    const response = await supertest(app)
      .get("/report/my")
      .set("Authorization", req.userToken);

    console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.report)).toBe(true);
    expect(response.body.report.length).toBe(1);
  });

  test("Pega status do meu report com sucesso", async () => {
    const response = await supertest(app)
      .get("/report/status/address/São Luís_Liberdade/geohash/7p8986c")
      .set("Authorization", req.adminToken);

    console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Busca feita com sucesso!");
    expect(response.body.status).toBe(0);
  });

  test("Deleta meu report como ADMIN com sucesso", async () => {
    const response = await supertest(app)
      .delete("/report")
      .send({
        address: "São Luís_Liberdade",
        geohash: "7p8986c",
      })
      .set("Authorization", req.adminToken);

    console.log(response.body);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Report deletado com sucesso!"
    );
  });

  test("Deleta report da minha vó como ADMIN com sucesso", async () => {
    const response = await supertest(app)
      .delete("/report")
      .send({
        address: "São Luís_Monte Castelo",
        geohash: "7p8983c",
      })
      .set("Authorization", req.adminToken);

    console.log(response.body);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Report deletado com sucesso!"
    );
  });

  test("Deleta meu report como USER com sucesso", async () => {
    const response = await supertest(app)
      .delete("/report")
      .send({
        address: "São Luís_Liberdade",
        geohash: "7p8986c",
      })
      .set("Authorization", req.userToken);

    console.log(response.body);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Report deletado com sucesso!"
    );
  });
});
