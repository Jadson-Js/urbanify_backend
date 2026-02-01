// LocalUserService.js - Serviço de usuário local para demonstração (sem AWS)
import JWT from "../utils/JWT.js";

// Usuários mockados em memória
const localUsers = [
    {
        id: "admin-001",
        email: "admin@admin.com",
        password: "admin123",
        role: "ADMIN",
        active: true,
        reports_id: [],
        service_counter: 5,
        created_at: "2025-01-01T00:00:00.000Z",
    },
    {
        id: "user-001",
        email: "usuario@urbanify.com",
        password: "12345678",
        role: "USER",
        active: true,
        reports_id: ["report-1", "report-2"],
        service_counter: 2,
        created_at: "2025-02-08T19:41:09.622Z",
    },
    {
        id: "user-002",
        email: "maria@urbanify.com",
        password: "12345678",
        role: "USER",
        active: true,
        reports_id: ["report-3"],
        service_counter: 1,
        created_at: "2025-09-25T19:41:09.622Z",
    },
    {
        id: "user-003",
        email: "joao@urbanify.com",
        password: "12345678",
        role: "USER",
        active: true,
        reports_id: [],
        service_counter: 0,
        created_at: "2025-02-08T19:41:09.622Z",
    },
    {
        id: "user-004",
        email: "ana@urbanify.com",
        password: "12345678",
        role: "USER",
        active: true,
        reports_id: ["report-4", "report-5"],
        service_counter: 2,
        created_at: "2025-06-14T19:41:09.622Z",
    },
];

class LocalUserService {
    async get() {
        const formatedUsers = localUsers.map((user) => {
            const { created_at, reports_id, service_counter } = user;
            return { created_at, report_counter: reports_id.length, service_counter };
        });

        return formatedUsers;
    }

    async login(email, password) {
        console.log(`[LOCAL] Tentativa de login: ${email}`);

        const user = localUsers.find(
            (u) => u.email === email && u.password === password
        );

        if (!user) {
            throw new Error("Email ou senha inválidos");
        }

        if (!user.active) {
            throw new Error("Usuário inativo");
        }

        console.log(`[LOCAL] Login bem-sucedido: ${email} (${user.role})`);

        const token = JWT.generate(user);
        return { ...user, token };
    }

    async authGoogle(email) {
        // Para Google Auth, cria ou retorna usuário baseado no email
        let user = localUsers.find((u) => u.email === email);

        if (!user) {
            // Cria novo usuário
            user = {
                id: `user-${Date.now()}`,
                email: email,
                password: "", // Sem senha para OAuth
                role: "USER",
                active: true,
                reports_id: [],
                service_counter: 0,
                created_at: new Date().toISOString(),
            };
            localUsers.push(user);
            console.log(`[LOCAL] Novo usuário criado via Google: ${email}`);
        }

        const token = JWT.generate(user);
        return { ...user, token };
    }
}

export default new LocalUserService();
