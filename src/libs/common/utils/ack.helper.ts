// src/common/utils/ack.helper.ts
export class Ack {
    static ok(data?: any) {
      return {
        success: true,
        message: "success",
        data: data ?? null,
        timestamp: Date.now(),
      };
    }
  
    static error(message: string, data?: any) {
      return {
        ok: false,
        message,
        data: data ?? null,
        timestamp: Date.now(),
      };
    }
  }
  