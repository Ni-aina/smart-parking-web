"use client";

import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { 
    createContext,
    ReactNode, 
    useContext, 
    useEffect, 
    useState 
} from "react";

const AuthContext = createContext<Session | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(data => {
            const { data: { session } } = data;
            setSession(session);
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setSession(session);
        })
        
        return ()=> subscription.unsubscribe();
    }, [])

    return (
        <AuthContext.Provider
            value={
                session
            }
        >
            {
                children
            }
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) return {
        user: null
    }
    const {
        user
    } = authContext;

    return {
        user
    }
}