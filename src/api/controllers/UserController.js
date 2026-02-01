// IMPORTANDO SERVICES - Usando serviço local para demonstração (sem AWS)
import LocalUserService from "../../services/LocalUserService.js";

class UserController {
  async get(req, res) {
    const users = await LocalUserService.get();
    res.status(200).json({ message: "Users retrieved successfully", users });
  }

  async signup(req, res) {
    // Signup desabilitado no modo local
    res.status(201).json({
      message: "User created successfully (demo mode)",
      user: { id: "demo", email: req.body.email }
    });
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await LocalUserService.login(email, password);

      res.status(200).json({
        message: "Login successful",
        accessToken: user.token.access,
        refreshToken: user.token.refresh,
      });
    } catch (error) {
      res.status(401).json({
        message: "Login failed",
        error: error.message,
      });
    }
  }

  async authGoogle(req, res) {
    const { authToken } = req.body;

    try {
      // No modo local, apenas usamos um email genérico para demo
      const user = await LocalUserService.authGoogle("google.user@demo.com");

      res.status(200).json({
        message: "Login successful",
        accessToken: user.token.access,
        refreshToken: user.token.refresh,
      });
    } catch (error) {
      res.status(401).json({
        message: "Google auth failed",
        error: error.message,
      });
    }
  }

  async generateAccessToken(req, res) {
    // Simplificado para modo demo
    res.status(200).json({
      message: "Access token generated successfully (demo mode)",
      accessToken: "demo-access-token",
    });
  }
}

export default new UserController();
