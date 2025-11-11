
export class UUID {
    static async random() {
        const { v4: uuidv4 } = await import("uuid");
        return uuidv4();
    }
}