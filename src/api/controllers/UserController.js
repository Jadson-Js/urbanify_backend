// IMPORTANDO SERVICES
import UserService from "../../services/UserService.js";

class UserController {
  async signup(req, res) {
    const { email, password } = req.body;

    await UserService.signup(email, password);
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  }

  async verifyEmailToken(req, res) {
    const { token } = req.params;

    await UserService.verifyEmailToken(token);

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

  async login(req, res) {
    const { email, password } = req.body;

    const user = await UserService.login(email, password);

    res.status(200).json({
      message: "Usuário logado com sucesso!",
      accessToken: user.token.access,
      refreshToken: user.token.refresh,
    });
  }

  async access(req, res) {
    const { refreshToken } = req.body;

    const accessToken = await UserService.access(refreshToken);

    res.status(200).json({
      message: "Novo token de acesso gerado",
      accessToken,
    });
  }

  async sendEmailToResetPassword(req, res) {
    const { email } = req.body;

    const data = await UserService.sendEmailToResetPassword(email);

    res.status(200).json({
      message: "Email enviado com sucesso!",
      data,
    });
  }

  async formToResetPassword(req, res) {
    const { token } = req.params;

    const data = await UserService.formToResetPassword(token);

    res.send(data);
  }

  async resetPassword(req, res) {
    const { user_email } = req;
    const { new_password } = req.body;

    const data = { user_email, new_password };

    await UserService.resetPassword(data);

    res.status(200).json({
      message: "Senha redefinida!",
    });
  }
}

export default new UserController();
