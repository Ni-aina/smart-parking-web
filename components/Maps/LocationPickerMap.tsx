"use client";

import {
    useEffect
} from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerMapProps {
    position: {
        lat: number
        lng: number
    } | null
    onSelectLocation: (
        lat: number,
        lng: number
    ) => void
}

const markerIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

const MapClickHandler = ({
    onSelectLocation
}: {
    onSelectLocation: (
        lat: number,
        lng: number
    ) => void
}) => {
    useMapEvents({
        click: (e) => {
            onSelectLocation(e.latlng.lat, e.latlng.lng)
        }
    })
    return null
}

const MapController = ({
    position
}: {
    position: {
        lat: number
        lng: number
    } | null
}) => {
    const map = useMap()

    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize()
        }, 200)
        return () => {
            clearTimeout(timer)
        }
    }, [map])
    
    useEffect(() => {
        if (position) {
            map.setView([position.lat, position.lng], map.getZoom())
        }
    }, [map, position])
    return null
}

const LocationPickerMap = ({
    position,
    onSelectLocation
}: LocationPickerMapProps) => {
    const defaultCenter: [number, number] = position
        ? [position.lat, position.lng]
        : [-18.8792, 47.5079]

    return (
        <div className="w-full h-80 rounded-md overflow-hidden relative z-0 border border-white/10">
            <MapContainer
                center={
                    defaultCenter
                }
                zoom={
                    position ? 15 : 13
                }
                scrollWheelZoom={true}
                className="w-full h-full"
            >
                <TileLayer
                    attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler
                    onSelectLocation={
                        onSelectLocation
                    }
                />
                <MapController
                    position={
                        position
                    }
                />
                {
                    position ?
                        <Marker
                            position={
                                [position.lat, position.lng]
                            }
                            icon={
                                markerIcon
                            }
                        />
                        : null
                }
            </MapContainer>
        </div>
    )
}

export default LocationPickerMap
