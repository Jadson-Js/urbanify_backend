import { sesSource } from "../config/environment.js";

class Tamplate {
  emailConfirm(email, token) {
    const tamplate = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Data: `
              <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Confirmation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .header {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin-bottom: 20px;
    }

    .message {
      font-size: 16px;
      color: #555;
      margin-bottom: 20px;
    }

    .button {
      display: inline-block;
      padding: 12px 24px;
      font-size: 16px;
      color: #555;
      border: 2px solid #555;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    }

    .footer {
      margin-top: 20px;
      font-size: 14px;
      color: #777;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">Confirme Seu Email</div>
    <div class="message">
      Olá! Clique no botão abaixo para verificar seu e-mail e ativar sua conta.
    </div>
    <a href="http://localhost:3000/user/verify/email/token/${token.access}" class="button">Confirm Email</a>
    <div class="footer">
      Se você não solicitou isso, ignore este e-mail.
    </div>
  </div>
</body>

</html>
            `,
          },
        },
        Subject: { Data: "Confirmar email" },
      },
      Source: sesSource,
    };

    console.log(tamplate.Message.Body.Html.Data);

    return tamplate;
  }

  responseConfirmEmail() {
    return `
      <!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verificado</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f9;
      color: #333;
      text-align: center;
      padding: 20px;
    }

    h1 {
      color: #4CAF50;
    }

    p {
      font-size: 1.2em;
      margin: 10px 0;
    }

    .container {
      max-width: 600px;
      margin: 50px auto;
      background: #fff;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
      border-radius: 10px;
    }
  </style>
</head>

<body>
  <div class="container">
    <h1>Sucesso!</h1>
    <p>Seu email já foi verificado.</p>
    <p>Seja bem-vindo à <strong>URBANIFY</strong>.</p>
  </div>
</body>

</html>
    `;
  }

  emailResetPassword(email, token) {
    const tamplate = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Data: `
              <!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redefinir Senha</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            text-align: center;
            padding: 20px;
        }
        h1 {
            color: #FF5722;
        }
        p {
            font-size: 1.2em;
        }
        a {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 1em;
            color: #fff;
            background-color: #FF5722;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s;
        }
        a:hover {
            background-color: #E64A19;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 20px;
            border-radius: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Redefinir Senha</h1>
        <p>Para redefinir sua senha, clique no link abaixo:</p>
        <a href="http://localhost:3000/user/reset-password/token/${token.access}">
            Clique aqui para redefinir sua senha
        </a>
    </div>
</body>
</html>

            `,
          },
        },
        Subject: { Data: "Confirmar email" },
      },
      Source: sesSource,
    };

    console.log(tamplate.Message.Body.Html.Data);

    return tamplate;
  }

  responseResetPasswordForm(token) {
    return `
      <!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redefinir Senha</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        form {
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
        }
        label {
            font-size: 1em;
            margin-bottom: 5px;
            display: block;
        }
        input[type="password"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        button {
            width: 100%;
            padding: 10px;
            background-color: #4CAF50;
            color: #fff;
            border: none;
            border-radius: 5px;
            font-size: 1em;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
  <form id="reset-form">
    <label for="password">Nova Senha:</label>
    <input type="password" id="password1" name="password" placeholder="Digite sua senha aqui" required>
    <input type="password" id="password2" name="password" placeholder="Digite novamente sua senha aqui" required>
    <button type="submit">Redefinir Senha</button>
  </form>
</body>
</html>


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
