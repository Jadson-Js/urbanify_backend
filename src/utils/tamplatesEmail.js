import { sesSource } from "../config/environment.js";

class Tamplate {
  emailConfirm(email, token) {
    return {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Data: `
              <html>
                <body>
                  <h1>Confirmação de email</h1>
                  <p>Olá! Para concluir o seu email, clique no link abaixo:</p>
                  <a href="http://localhost:3000/user/verify/email/token/${token.access}">Clique aqui para confirmar seu email</a>
                </body>
              </html>
            `,
          },
        },
        Subject: { Data: "Confirmar email" },
      },
      Source: sesSource,
    };
  }

  responseConfirmEmail() {
    return `
      <html>
        <head><title>Email Verificado</title></head>
        <body>
            <h1>Sucesso!</h1>
            <p>Seu email ja foi verificado.</p></br>
            <p>Seja bem vindo a URBANIFY.</p>
        </body>
      </html>
    `;
  }

  emailResetPassword(email, token) {
    return {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Data: `
              <html>
                <body>
                  <h1>Redefinir senha</h1>
                  <p>Para redefinir sua senha entre nesse link</p>
                  <a href="http://localhost:3000/user/reset-password/token/${token.access}">Clique aqui para redefinir sua senha</a>
                </body>
              </html>
            `,
          },
        },
        Subject: { Data: "Confirmar email" },
      },
      Source: sesSource,
    };
  }

  responseResetPasswordForm(token) {
    return `
      <form id="reset-form">
        <label for="password">Nova Senha:</label>
        <input type="password" id="password1" name="password" required>
        <input type="password" id="password2" name="password" required>
        <button type="submit">Redefinir Senha</button>
      </form>

      <script>
        document.getElementById("reset-form").addEventListener("submit", async (event) => {
          event.preventDefault();

          const token = "${token.access}"; 
          if (document.getElementById("password1").value !== document.getElementById("password2").value) {
            alert("As senhas não são iguais");
            return;
          }
          const password = document.getElementById("password1").value;

          const response = await fetch("http://localhost:3000/user/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ${token}'
            },
            body: JSON.stringify({ new_password: password }),
          });

          const data = await response.json();
        });
      </script>

    `;
  }
}

export default new Tamplate();
