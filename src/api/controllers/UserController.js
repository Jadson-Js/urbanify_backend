// IMPORTANDO SERVICES
import UserService from "../../services/UserService.js";

class UserController {
  async signup(req, res) {
    const { email, password } = req.body;

    const user = await UserService.signup(email, password);
    res.status(201).json({ message: "User created successfully", user });
  }

  async verifyEmailToken(req, res) {
    const { accessToken } = req.params;

    const response = await UserService.verifyEmailToken(accessToken);

    res.send(response);
  }

  async login(req, res) {
    const { email, password } = req.body;

    const user = await UserService.login(email, password);

    res.status(200).json({
      message: "Login successful",
      accessToken: user.token.access,
      refreshToken: user.token.refresh,
    });
  }

  async generateAccessToken(req, res) {
    const { refreshToken } = req.body;

    const accessToken = await UserService.generateAccessToken(refreshToken);

    res.status(200).json({
      message: "Access token generated successfully",
      accessToken,
    });
  }

  async sendEmailToResetPassword(req, res) {
    const { email } = req.body;

    const data = await UserService.sendEmailToResetPassword(email);

    res.status(200).json({
      message: "Send email successfully!",
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
      message: "Reset password successfully",
    });
  }
}

export default new UserController();
