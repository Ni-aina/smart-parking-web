"use client";

import Loading from "@/components/ui/loading";
import { supabase } from "@/lib/supabase/client";
import checkSessionExpired from "@/utils/chekSessionExpired";
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
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {

        (async function () {
            setIsPending(true);
            const { data: { session } } = await supabase.auth.getSession();
            const expiresAt = session?.expires_at || null;
            if(checkSessionExpired(expiresAt)) {
                setIsPending(false);
                return;
            }
            setSession(session);
            setIsPending(false);
        })()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setSession(session);
        })

        return () => subscription.unsubscribe();
    }, [])

    if (isPending) return (
        <div className="w-full h-dvh">
            <Loading />
        </div>
    )

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