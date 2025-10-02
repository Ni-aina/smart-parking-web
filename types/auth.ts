import { Session, User, WeakPassword } from "@supabase/supabase-js";

export interface AuthUserInterface {
    user: User | null;
    session: Session | null;
    weakPassword?: WeakPassword | null;
}