import LogModel from "../models/LogModel.js";
import crypto from "crypto";

class LogService {
  async get() {
    const logs = await LogModel.get();

    return logs;
  }

  async create(data) {
    const log = {
      id: crypto.randomBytes(32).toString("hex"),
      created_at: new Date().toISOString(),
      report_count: data.report_count,
      status: data.status,
      district: data.district,
      street: data.street,
    };

    return await LogModel.create(log);
  }
}

export default new LogService();
