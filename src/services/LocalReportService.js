// LocalReportService.js - Serviço de reports local para demonstração (sem AWS)

// Dados mockados dos reports (mesmos dados do frontend)
const localReports = [
    {
        district: "Liberdade",
        street: "Rua Machado De Assis",
        status: 0,
        subregion: "São Luís",
        id: "367880",
        address: "São Luís_Liberdade",
        geohash: "7p8986c",
        created_at: "2025-09-22T19:41:09.622Z",
        coordinates: { latitude: "-2.542864866", longitude: "-44.084725472" },
        childrens: [
            { severity: 1, created_at: "2025-03-12T19:41:09.622Z" },
            { severity: 0, created_at: "2025-10-12T19:41:09.622Z" },
        ],
    },
    {
        district: "Monte Castelo",
        street: "Rua Paulo Fontin",
        status: 1,
        subregion: "São Luís",
        id: "912133",
        address: "São Luís_Monte Castelo",
        geohash: "7p8986c",
        created_at: "2025-04-21T19:41:09.622Z",
        coordinates: { latitude: "-2.568651724", longitude: "-44.078447487" },
        childrens: [
            { severity: 0, created_at: "2025-07-01T19:41:09.622Z" },
            { severity: 1, created_at: "2025-09-21T19:41:09.622Z" },
        ],
    },
    {
        district: "Centro",
        street: "Rua Da Paz",
        status: 0,
        subregion: "São Luís",
        id: "209218",
        address: "São Luís_Centro",
        geohash: "7p8986c",
        created_at: "2025-04-26T19:41:09.622Z",
        coordinates: { latitude: "-2.513165544", longitude: "-44.047777341" },
        childrens: [
            { severity: 0, created_at: "2025-11-12T19:41:09.622Z" },
            { severity: 1, created_at: "2025-05-27T19:41:09.622Z" },
        ],
    },
    {
        district: "Calhau",
        street: "Av. Litorânea",
        status: 1,
        subregion: "São Luís",
        id: "567172",
        address: "São Luís_Calhau",
        geohash: "7p8986c",
        created_at: "2025-02-25T19:41:09.622Z",
        coordinates: { latitude: "-2.582734254", longitude: "-44.051415343" },
        childrens: [
            { severity: 0, created_at: "2025-06-17T19:41:09.622Z" },
            { severity: 1, created_at: "2025-07-06T19:41:09.622Z" },
        ],
    },
];

const localResolvedReports = [
    {
        district: "Liberdade",
        street: "Rua Machado De Assis",
        status: 2,
        subregion: "São Luís",
        id: "805776",
        address: "São Luís_Liberdade",
        geohash: "7p8986c",
        created_at: "2025-12-17T19:41:09.622Z",
        coordinates: { latitude: "-2.26471145", longitude: "-44.12487842" },
        childrens: [
            { severity: 2, created_at: "2025-07-26T19:41:09.622Z" },
            { severity: 2, created_at: "2025-08-06T19:41:09.622Z" },
        ],
    },
    {
        district: "Monte Castelo",
        street: "Rua Paulo Fontin",
        status: 2,
        subregion: "São Luís",
        id: "276401",
        address: "São Luís_Monte Castelo",
        geohash: "7p8986c",
        created_at: "2025-12-18T19:41:09.622Z",
        coordinates: { latitude: "-2.42346541", longitude: "-44.45415744" },
        childrens: [
            { severity: 2, created_at: "2025-06-17T19:41:09.622Z" },
        ],
    },
];

class LocalReportService {
    async getAll() {
        console.log("[LOCAL] Retornando reports mockados");
        return localReports;
    }

    async getEvaluated() {
        return localReports.filter((r) => r.status === 1);
    }

    async getByLocal(address, geohash) {
        const report = localReports.find(
            (r) => r.address === address && r.geohash === geohash
        );
        return {
            report,
            urls: ["https://via.placeholder.com/400x300?text=Report+Photo"]
        };
    }

    async getResolved() {
        console.log("[LOCAL] Retornando reports resolvidos mockados");
        return localResolvedReports;
    }

    async getResolvedByKeys(id, created_at) {
        const report = localResolvedReports.find(
            (r) => r.id === id && r.created_at === created_at
        );
        return {
            report,
            urls: ["https://via.placeholder.com/400x300?text=Resolved+Photo"]
        };
    }
}

export default new LocalReportService();
