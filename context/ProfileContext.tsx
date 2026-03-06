"use client"

import { ProfileInterface } from "@/types/profile";
import { createContext, ReactNode, useContext } from "react";

interface ProfileContextType {
    currentProfile: ProfileInterface | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const ProfileContextProvider = ({ 
    children,
    currentProfile
 }: { 
    children: ReactNode,
    currentProfile: ProfileInterface | null
 }) => {
    return (
        <ProfileContext.Provider
            value={{ currentProfile }}
        >
            {
                children
            }
        </ProfileContext.Provider>
    )
}

export default ProfileContextProvider;

export const useProfileContext = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error("useProfileContext must be used within a ProfileContextProvider");
    }

    const { currentProfile } = context;

    return {
        currentProfile
    }
}