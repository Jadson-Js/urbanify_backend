import UserService from "../../services/UserService.js";

class UserController {
  async signup(req, res) {
    const { email, password } = req.body;

    await UserService.signup(email, password);
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  }

  async login(req, res) {
    const { email, password } = req.body;

    const user = await UserService.login(email, password);

    res
      .status(200)
      .json({ message: "Usuário logado com sucesso!", token: user.token });
  }
}

export default new UserController();
