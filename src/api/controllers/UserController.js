import UserService from "../../services/UserService.js";

class UserController {
  async signup(req, res) {
    await UserService.signup(req.body);
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  }

  async login(req, res) {
    const user = await UserService.login(req.body.email, req.body.password);
    res
      .status(200)
      .json({ message: "Usuário logado com sucesso!", token: user.token });
  }

  async getReports(req, res) {
    const reports = await UserService.login(req.body.email, req.body.password);

    res
      .status(200)
      .json({ message: "Usuário logado com sucesso!", token: user.token });
  }
}

export default new UserController();
