"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Search, Navigation, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface LocationPickerProps {
    onLocationSelect?: (address: any) => void
    onCancel: () => void
}

export function LocationPicker({ onLocationSelect, onCancel }: LocationPickerProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [address, setAddress] = useState<any>(null)
    const mapRef = useRef<any>(null)
    const markerRef = useRef<any>(null)
    const mapContainerRef = useRef<HTMLDivElement>(null)

    // Load Leaflet from CDN
    useEffect(() => {
        const loadLeaflet = async () => {
            if (typeof window === "undefined") return

            // Check if Leaflet CSS is already added
            if (!document.getElementById("leaflet-css")) {
                const link = document.createElement("link")
                link.id = "leaflet-css"
                link.rel = "stylesheet"
                link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                document.head.appendChild(link)
            }

            // Check if Leaflet JS is already added
            if (!window.L) {
                const script = document.createElement("script")
                script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                script.async = true
                script.onload = initMap
                document.body.appendChild(script)
            } else {
                initMap()
            }
        }

        loadLeaflet()

        return () => {
            if (mapRef.current) {
                mapRef.current.remove()
                mapRef.current = null
            }
        }
    }, [])

    const initMap = () => {
        if (!mapContainerRef.current || mapRef.current || !window.L) return

        // Default to New York if no location
        const defaultLat = 40.7128
        const defaultLng = -74.006

        const map = window.L.map(mapContainerRef.current).setView([defaultLat, defaultLng], 13)

        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map)

        // Add click handler
        map.on("click", (e: any) => {
            handleMapClick(e.latlng.lat, e.latlng.lng)
        })

        mapRef.current = map
    }

    const handleMapClick = async (lat: number, lng: number) => {
        if (!mapRef.current || !window.L) return

        // Update marker
        if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng])
        } else {
            const icon = window.L.icon({
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
            })
            markerRef.current = window.L.marker([lat, lng], { icon }).addTo(mapRef.current)
        }

        setSelectedLocation({ lat, lng })
        fetchAddress(lat, lng)
    }

    const fetchAddress = async (lat: number, lng: number) => {
        setIsLoading(true)
        try {
            const response = await fetch(`https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}`)
            const data = await response.json()

            if (data && data.features && data.features.length > 0) {
                const props = data.features[0].properties
                const formattedAddress = {
                    streetAddress: [props.street, props.housenumber].filter(Boolean).join(" ") || props.name || "",
                    village: props.suburb || props.quarter || props.neighbourhood || "",
                    district: props.district || props.city_district || "",
                    city: props.city || props.town || "",
                    province: props.state || "",
                    postalCode: props.postcode || "",
                    country: props.country || "",
                    fullAddress: [
                        props.name,
                        props.street,
                        props.housenumber,
                        props.suburb,
                        props.district,
                        props.city,
                        props.state,
                        props.postcode,
                    ]
                        .filter(Boolean)
                        .join(", "),
                    rawProperties: props, // Keep raw properties just in case
                }
                setAddress(formattedAddress)
            }
        } catch (error) {
            console.error("Error fetching address:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = async () => {
        if (!searchQuery) return

        setIsLoading(true)
        try {
            const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=1`)
            const data = await response.json()

            if (data && data.features && data.features.length > 0) {
                const [lng, lat] = data.features[0].geometry.coordinates

                if (mapRef.current) {
                    mapRef.current.setView([lat, lng], 16)
                    handleMapClick(lat, lng)
                }
            }
        } catch (error) {
            console.error("Error searching location:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCurrentLocation = () => {
        if ("geolocation" in navigator) {
            setIsLoading(true)
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    if (mapRef.current) {
                        mapRef.current.setView([latitude, longitude], 16)
                        handleMapClick(latitude, longitude)
                    }
                    setIsLoading(false)
                },
                (error) => {
                    console.error("Error getting location:", error)
                    setIsLoading(false)
                },
            )
        }
    }

    const handleConfirm = () => {
        if (address) {
            onLocationSelect?.(address)
        }
    }

    return (
        <div className="space-y-4">
            <div className="relative flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search for a location..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>
                <Button onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </Button>
                <Button size="icon" variant="outline" onClick={handleCurrentLocation} title="Use current location">
                    <Navigation className="h-4 w-4" />
                </Button>
            </div>

            <div className="relative w-full h-[300px] bg-muted rounded-md overflow-hidden border border-border">
                <div ref={mapContainerRef} className="w-full h-full z-0" />
            </div>

            <div className="bg-muted/30 p-3 rounded-md space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Selected Location</span>
                </div>
                {address ? (
                    <div className="text-sm text-muted-foreground">
                        <p>{address.fullAddress}</p>
                        <p className="text-xs mt-1 opacity-70">
                            Lat: {selectedLocation?.lat.toFixed(6)}, Lng: {selectedLocation?.lng.toFixed(6)}
                        </p>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground italic">Click on the map to select a location</p>
                )}
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button onClick={handleConfirm} disabled={!address}>
                    Confirm Location
                </Button>
            </div>
        </div>
    )
}
