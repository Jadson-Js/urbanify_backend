import supertest from "supertest";
import app from "../../app.js";

describe("User Routes", () => {
  // test("Should signup with successfuly", async () => {
  //   const response = await supertest(app).post("/user/signup").send({
  //     email: "user@admin.com",
  //     password: "admin123",
  //   });

  //   expect(response.statusCode).toBe(201);
  //   expect(response.body).toEqual({
  //     message: "Usuário criado com sucesso!",
  //   });
  // });

  test("Should login with successfuly", async () => {
    const response = await supertest(app).post("/user/login").send({
      email: "admin@admin.com",
      password: "admin123",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Usuário logado com sucesso!"
    );
    expect(response.body).toHaveProperty("token");
  });
});
