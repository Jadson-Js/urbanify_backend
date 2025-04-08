// IMPORTANDO SERVICES
import UserService from "../../services/UserService.js";

class UserController {
  async get(req, res) {
    const users = await UserService.get();
    res.status(200).json({ message: "Users retrieved successfully", users });
  }

  async authGoogle(req, res) {
    const { authToken } = req.body;

    const user = await UserService.authGoogle(authToken);

    res.status(200).json({
      message: "Login successful",
      user,
      // accessToken: user.token.access,
      // refreshToken: user.token.refresh,
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
}

export default new UserController();
