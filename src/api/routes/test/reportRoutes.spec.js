import supertest from "supertest";
import app from "../../app.js";

const req = {
  adminToken:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTczOTkwNzQ1NSwiZXhwIjoxNzQyNDk5NDU1fQ.nhqd3llOMuV7czOv0PwLUoIgukx-Bbj8rG24m2wM5n0",

  userToken:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAYWRtaW4uY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3Mzk5MDQ5MjMsImV4cCI6MTc0MjQ5NjkyM30.RVKp62l0jQ1Mq_gqv1Na1cNb7qhOM4pNr9UtdUVSUX8",

  filePath:
    "/home/magnus/developments/works/urbanify/urbanify_backend/yugiro.jpg",
  report: {
    my: `{  "subregion": "São Luís",  "district": "Liberdade",  "street": "Rua Machado De Assis",  "severity": "Moderado",  "coordinates": {    "latitude": "-2.5325999611122065",    "longitude": "-44.284021668688126"  }}`,

    neighbor: `{  "subregion": "São Luís",  "district": "Liberdade",  "street": "Rua Machado De Assis",  "severity": "Moderado",  "coordinates": {    "latitude": "-2.5328124698162275",    "longitude": "-44.28404927311758"  }}`,
  },
};

describe("Report Routes", () => {
  test("Should create report with successfuly", async () => {
    const response = await supertest(app)
      .post("/report")
      .set("Authorization", adminToken)
      .field("data", reportPosition0)
      .attach("file", filePath);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Report cadastrado com sucesso!"
    );
    //expect(response.body).toHaveProperty("report");
  });
});
