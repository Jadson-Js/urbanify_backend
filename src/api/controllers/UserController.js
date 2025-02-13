import UserService from "../../services/UserService.js";

class UserController {
  async signup(req, res) {
    try {
      await UserService.signup(req.body);
      res.status(201).json({ message: "Usuário criado com sucesso!" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar usuário.", error });
    }
  }

  async login(req, res) {
    try {
      const user = await UserService.login(req.body.email, req.body.password);
      res
        .status(200)
        .json({ message: "Usuário logado com sucesso!", token: user.token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao logar usuário.", error });
    }
  }

  async getReports(req, res) {
    try {
      const reports = await UserService.login(
        req.body.email,
        req.body.password
      );

      res
        .status(200)
        .json({ message: "Usuário logado com sucesso!", token: user.token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao logar usuário.", error });
    }
  }
}

export default new UserController();
