"use client";

import {
    useState,
    useEffect
} from "react";
import dynamic from "next/dynamic";
import {
    Loader2,
    MapPin,
    XCircle
} from "lucide-react";
import {
    reverseGeocode
} from "@/utils/openstreetmap";

interface LocationResult {
    address: string
    lat: number
    lng: number
}

interface LocationPickerModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (location: LocationResult) => void
    initialAddress?: string
    initialLat?: number | null
    initialLng?: number | null
}

const LocationPickerMap = dynamic(
    () => import("./LocationPickerMap"),
    {
        ssr: false,
        loading: () =>
            <div className="w-full h-80 flex items-center justify-center bg-white/5 rounded-md border border-white/10">
                <Loader2 className="animate-spin text-red-500" size={28} />
            </div>
    }
)

const LocationPickerModal = ({
    isOpen,
    onClose,
    onConfirm,
    initialAddress,
    initialLat,
    initialLng
}: LocationPickerModalProps) => {
    const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null)
    const [isLoadingAddress, setIsLoadingAddress] = useState(false)

    useEffect(() => {
        if (isOpen) {
            if (initialLat !== undefined && initialLat !== null && initialLng !== undefined && initialLng !== null) {
                setSelectedLocation({
                    address: initialAddress || "",
                    lat: initialLat,
                    lng: initialLng
                })
            }
            else {
                setSelectedLocation(null)
            }
        }
    }, [isOpen, initialAddress, initialLat, initialLng])

    if (!isOpen) return null

    const handleSelectLocation = async (lat: number, lng: number) => {
        setIsLoadingAddress(true)
        const address = await reverseGeocode(lat, lng)
        setSelectedLocation({
            address,
            lat,
            lng
        })
        setIsLoadingAddress(false)
    }

    const handleConfirm = () => {
        if (selectedLocation) {
            onConfirm(selectedLocation)
            onClose()
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-[#141414] border border-white/10 rounded-lg shadow-2xl w-full max-w-2xl p-6 flex flex-col gap-4 relative text-white"
                onClick={(e) => {
                    e.stopPropagation()
                }}
            >
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <MapPin size={20} className="text-red-500" />
                        <h2 className="text-md font-semibold uppercase tracking-wider text-white">
                            Select location on map
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-white/60 hover:text-white cursor-pointer transition-colors"
                    >
                        <XCircle size={22} />
                    </button>
                </div>

                <LocationPickerMap
                    position={
                        selectedLocation ? {
                            lat: selectedLocation.lat,
                            lng: selectedLocation.lng
                        } : null
                    }
                    onSelectLocation={handleSelectLocation}
                />

                <div className="flex flex-col gap-2 p-3 bg-white/5 border border-white/10 rounded-md text-sm">
                    {
                        isLoadingAddress ?
                            <div className="flex items-center gap-2 text-white/70 py-1">
                                <Loader2 size={16} className="animate-spin text-red-500" />
                                <span>Resolving address...</span>
                            </div>
                            :
                            selectedLocation ?
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-white/50 uppercase tracking-wider">Address</span>
                                        <span className="text-white font-medium wrap-break-word mt-0.5">{selectedLocation.address}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-white/60 pt-1 border-t border-white/5">
                                        <span>Latitude: {selectedLocation.lat.toFixed(6)}</span>
                                        <span>Longitude: {selectedLocation.lng.toFixed(6)}</span>
                                    </div>
                                </div>
                                :
                                <span className="text-white/50 italic py-1">Click anywhere on the map to place a marker and select a location.</span>
                    }
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 rounded-sm bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!selectedLocation || isLoadingAddress}
                        className="px-5 py-2 rounded-sm bg-white text-black hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity cursor-pointer text-sm font-medium"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LocationPickerModal
