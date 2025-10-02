import { supabase } from "@/lib/supabase";
import { AuthUserInterface } from "@/types/auth";

export async function logIn(email: string, password: string): 
Promise<AuthUserInterface> {
    const { data } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    return data;
}

export async function logOut() {
    await supabase.auth.signOut();
}