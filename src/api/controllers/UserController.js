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

    res.status(200).json({
      message: "Usuário logado com sucesso!",
      accessToken: user.token.access,
      refreshToken: user.token.refresh,
    });
  }

  async accesss(req, res) {
    const { refreshToken } = req.body;

    const accessToken = await UserService.access(refreshToken);

    res.status(200).json({
      message: "Novo token de acesso gerado",
      accessToken,
    });
  }

  async verifyEmailToken(req, res) {
    const { token } = req.params;

    const response = await UserService.verifyToken(token);

    res.send(`
      <html>
          <head><title>Email Verificado</title></head>
          <body>
              <h1>Sucesso!</h1>
              <p>Seu email ja foi verificado.</p></br>
              <p>Seja bem vindo a URBANIFY.</p>
          </body>
      </html>
  `);
  }

  // async requestResetPassword(req, res) {
  //   const { email } = req.body;

  //   const data = await UserService.sendCodeToResetPassword(email);

  //   res.status(200).json({
  //     message: "Email enviado com sucesso!",
  //     data,
  //   });
  // }

  // async authResetPassword(req, res) {
  //   const params = req.body;

  //   await UserService.authCodeToResetPassword(params);

  //   res.status(200).json({
  //     message: "Senha redefinida!",
  //   });
  // }
}

export default new UserController();
