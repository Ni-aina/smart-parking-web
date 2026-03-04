import { Session, User, WeakPassword } from "@supabase/supabase-js";

export interface AuthUserInterface {
    user: User | null;
    session: Session | null;
    weakPassword?: WeakPassword | null;
}

export interface SignUpForm {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}