import "express-session";


declare global {
    interface AuthUser {
        id: string;
        type: string;
        fullname: string;
        roles: string[];
    }

    namespace Express {

        interface Request {
            user?: AuthUser;
            session?: Express.Session & { authenticated?: boolean; user?: AuthUser };
        }
        
    }

}
