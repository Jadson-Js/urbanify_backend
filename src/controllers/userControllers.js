// Importando os serviços
import { saveUser, findUser } from "../services/userServices.js";

// Informa ao service o req.body, com a finalidade de salvar o usuario ao banco de dados
export const signup = async (req, res) => {
  try {
    const user = await saveUser(req.body);

    res.status(201).json({ message: "Usuário criado com sucesso!", user });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário.", error });
  }
};

// Informa ao service o req.body, com a finalidade de logar o usuario ao sistema
export const login = async (req, res) => {
  try {
    const user = await findUser(req.body.email, req.body.password);

    res.status(201).json({ message: "Usuário logado com sucesso!", user });
  } catch (error) {
    res.status(500).json({ message: "Erro ao logar usuário.", error });
  }
};
