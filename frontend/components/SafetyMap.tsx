"use client"

import { useEffect, useState, useRef } from 'react'

interface SafetyMarker {
  position: { lat: number; lng: number }
  title: string
  icon: string
  location: string
  safety_score: number
  safety_level: string
  recommendations: string[]
  infraction_count: number
  details: {
    reasoning: string
    has_street_parking: boolean
    nearby_lots: number
    time_restrictions: string[]
    peak_infraction_times: string[]
    best_parking_times: string[]
    free_parking_hours: boolean
    available_street_parking: number
    score_details: {
      score_breakdown: any
      reasoning: string[]
    }
    street_parking_analysis: {
      parking_cost_info: string
      hours: string
      payment_methods: string[]
      free_parking_details: string[]
    }
    parking_lots_analysis: {
      available_lots: number
      free_options: string[]
      accessibility: string[]
    }
    infraction_analysis: {
      most_common_violation: string
      recent_count: number
      severity_score: number
      average_fine: number
    }
  }
}

interface SafetyMapProps {
  apiKey: string
}

export default function SafetyMap({ apiKey }: SafetyMapProps) {
  const [markers, setMarkers] = useState<SafetyMarker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  
  // 🚩 FLAG to ensure map initializes exactly once
  const mapInitializedRef = useRef(false)

  useEffect(() => {
    fetchSafetyData()
    getUserLocation()
  }, [])

  // Initialize map when we have both API key and markers
  useEffect(() => {
    if (apiKey && markers.length > 0 && userLocation && !mapInitializedRef.current) {
      initMap()
    }
  }, [apiKey, markers, userLocation])

  const fetchSafetyData = async () => {
    try {
      console.log('🔄 Fetching safety data from backend...')
      const response = await fetch('https://avoid-the-fine-backend-660696fc9123.herokuapp.com/api/safety-markers')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Extract markers and explicitly type cast to SafetyMarker[] interface
      const safetyMarker: SafetyMarker[] = data.markers as SafetyMarker[] || []
      console.log(`✅ Loaded ${safetyMarker.length} safety markers`)
      
      setMarkers(safetyMarker)
      setLoading(false)
      
    } catch (err) {
      console.error('❌ Error fetching safety data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load safety data')
      setLoading(false)
    }
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          console.log(`📍 User location: ${latitude}, ${longitude}`)
        },
        (error) => {
          console.warn('⚠️ Could not get user location:', error.message)
          // Fallback to Waterloo center if geolocation fails
          setUserLocation({ lat: 43.4723, lng: -80.5449 })
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    } else {
      console.warn('⚠️ Geolocation not supported, using Waterloo center')
      setUserLocation({ lat: 43.4723, lng: -80.5449 })
    }
  }

  const initMap = async (): Promise<void> => {
    // 🚩 CHECK FLAG - only run once
    if (mapInitializedRef.current) {
      console.log('⚠️ Map already initialized, skipping...')
      return
    }

    if (!mapRef.current) {
      console.error('❌ Map container not found')
      return
    }

    try {
      console.log('🗺️ Initializing Google Maps...')
      mapInitializedRef.current = true

      // Load Google Maps script dynamically
      if (!window.google) {
        await loadGoogleMapsScript()
      }

      // Request needed libraries
      //@ts-ignore
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary

      // Use user location or fallback to Waterloo
      const centerLocation = userLocation || { lat: 43.4723, lng: -80.5449 }

      // Create the map, centered on user location
      const mapInstance = new Map(mapRef.current, {
        zoom: 15, // Closer zoom for user location
        center: centerLocation,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID, // Use environment variable
        styles: [
          { elementType: "geometry", stylers: [{ color: "#212121" }] },
          { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
          {
            featureType: "administrative",
            elementType: "geometry",
            stylers: [{ color: "#757575" }]
          },
          {
            featureType: "administrative.country",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9e9e9e" }]
          },
          {
            featureType: "administrative.land_parcel",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#bdbdbd" }]
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#757575" }]
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#181818" }]
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#616161" }]
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#1b1b1b" }]
          },
          {
            featureType: "road",
            elementType: "geometry.fill",
            stylers: [{ color: "#2c2c2c" }]
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#8a8a8a" }]
          },
          {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [{ color: "#373737" }]
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#3c3c3c" }]
          },
          {
            featureType: "road.highway.controlled_access",
            elementType: "geometry",
            stylers: [{ color: "#4e4e4e" }]
          },
          {
            featureType: "road.local",
            elementType: "labels.text.fill",
            stylers: [{ color: "#616161" }]
          },
          {
            featureType: "transit",
            elementType: "labels.text.fill",
            stylers: [{ color: "#757575" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#000000" }]
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#3d3d3d" }]
          }
        ]
      })

      setMap(mapInstance)
      console.log('✅ Map initialized successfully')

      // Add user location marker if available
      if (userLocation) {
        console.log('📍 Adding user location marker...')
        const userMarkerElement = createUserLocationMarkerElement()
        
        const userMarker = new AdvancedMarkerElement({
          map: mapInstance,
          position: userLocation,
          title: 'Your Location',
          content: userMarkerElement,
          zIndex: 1000
        })

        // Add click listener for user location info
        userMarker.addListener('click', () => {
          showUserLocationInfo(mapInstance, userLocation)
        })
      }

      // Add safety markers
      console.log(`📍 Adding ${markers.length} safety markers...`)
      
      for (let i = 0; i < markers.length; i++) {
        const markerData = markers[i]
        
        console.log(`📍 Adding marker ${i + 1}: ${markerData.location} at (${markerData.position.lat}, ${markerData.position.lng})`)
        
        // Create custom marker element with color based on safety
        const markerElement = createSafetyMarkerElement(markerData)
        
        // Create advanced marker
        const advancedMarker = new AdvancedMarkerElement({
          map: mapInstance,
          position: markerData.position,
          title: markerData.title,
          content: markerElement
        })

        // Add click listener for info window
        advancedMarker.addListener('click', () => {
          showInfoWindow(mapInstance, markerData, advancedMarker.position!)
        })
      }

      console.log('✅ All markers added successfully')

    } catch (error) {
      console.error('❌ Error initializing map:', error)
      setError('Failed to initialize map')
      mapInitializedRef.current = false // Reset flag on error
    }
  }

  const loadGoogleMapsScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker`
      script.async = true
      script.defer = true
      
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Google Maps script'))
      
      document.head.appendChild(script)
    })
  }

  const createSafetyMarkerElement = (markerData: SafetyMarker): HTMLElement => {
    const element = document.createElement('div')
    element.className = 'safety-marker'
    
    // Get color based on safety level
    const color = getSafetyColor(markerData.safety_level)
    
    element.innerHTML = `
      <div style="
        width: 20px;
        height: 20px;
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        color: white;
      ">
        🅿️
      </div>
    `
    
    return element
  }

  const createUserLocationMarkerElement = (): HTMLElement => {
    const element = document.createElement('div')
    element.className = 'user-location-marker'
    
    element.innerHTML = `
      <div style="
        position: relative;
        width: 30px;
        height: 30px;
      ">
        <!-- Pulsing ring -->
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 45px;
          height: 45px;
          background-color: #4285f4;
          border-radius: 50%;
          opacity: 0.3;
          animation: pulse 2s infinite;
        "></div>
        
        <!-- Inner blue dot -->
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 16px;
          height: 16px;
          background-color: #4285f4;
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>
        
        <!-- Center white dot -->
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 4px;
          height: 4px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
      
      <style>
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.1;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0.3;
          }
        }
      </style>
    `
    
    return element
  }

  const showInfoWindow = (mapInstance: google.maps.Map, markerData: SafetyMarker, position: google.maps.LatLng | google.maps.LatLngLiteral) => {
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="
          max-width: 420px; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #e5e7eb;
          background: #111827;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          max-height: 600px;
          overflow-y: auto;
        ">
          <h3 style="
            margin: 0 0 16px 0; 
            color: #ffffff; 
            font-size: 20px; 
            font-weight: 600;
            line-height: 1.4;
            border-bottom: 2px solid #374151;
            padding-bottom: 8px;
          ">${markerData.location}</h3>
          
          <!-- Safety Level -->
          <div style="margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <span style="color: #9ca3af; font-weight: 500;">Safety Level:</span>
            <span style="
              color: ${getSafetyColor(markerData.safety_level)}; 
              font-weight: 600;
              font-size: 16px;
            ">${markerData.safety_level.replace('_', ' ').toUpperCase()}</span>
            <span style="color: #6b7280; font-size: 14px;">(${(markerData.safety_score * 100).toFixed(0)}%)</span>
          </div>
          
          <!-- Parking Cost Info -->
          ${markerData.details.street_parking_analysis?.parking_cost_info && markerData.details.street_parking_analysis.parking_cost_info !== 'Unknown' ? 
            `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px;">💰</span>
              <span style="color: #e5e7eb;">${markerData.details.street_parking_analysis.parking_cost_info}</span>
            </div>` : ''
          }
          
          <!-- Hours Info -->
          ${markerData.details.street_parking_analysis?.hours && markerData.details.street_parking_analysis.hours !== 'Unknown' ? 
            `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px;">🕐</span>
              <span style="color: #e5e7eb;">${markerData.details.street_parking_analysis.hours}</span>
            </div>` : ''
          }
          
          <!-- Street Parking -->
          ${markerData.details.has_street_parking ? 
            `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px;">🅿️</span>
              <span style="color: #e5e7eb;">Street parking available${markerData.details.available_street_parking > 0 ? ` (${markerData.details.available_street_parking} spaces)` : ''}</span>
            </div>` : ''
          }
          
          <!-- Nearby Lots -->
          ${markerData.details.nearby_lots > 0 ? 
            `<div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px;">🏢</span>
              <span style="color: #e5e7eb;">${markerData.details.nearby_lots} nearby parking lot${markerData.details.nearby_lots > 1 ? 's' : ''}</span>
            </div>` : ''
          }
          
          <!-- Free Parking Options -->
          ${markerData.details.parking_lots_analysis?.free_options?.length > 0 ? 
            `<div style="margin-bottom: 16px;">
              <div style="color: #10b981; font-weight: 500; margin-bottom: 6px; font-size: 14px;">🆓 Free Parking Options:</div>
              <ul style="margin: 0; padding-left: 20px; color: #e5e7eb; font-size: 13px; line-height: 1.4;">
                ${markerData.details.parking_lots_analysis.free_options.map(option => 
                  `<li style="margin: 4px 0;">${option}</li>`
                ).join('')}
              </ul>
            </div>` : ''
          }
          
          <!-- Time Restrictions -->
          ${markerData.details.time_restrictions?.length > 0 ? 
            `<div style="margin-bottom: 16px;">
              <div style="color: #f59e0b; font-weight: 500; margin-bottom: 6px; font-size: 14px;">⏰ Time Restrictions:</div>
              <ul style="margin: 0; padding-left: 20px; color: #e5e7eb; font-size: 13px; line-height: 1.4;">
                ${markerData.details.time_restrictions.map(restriction => 
                  `<li style="margin: 4px 0;">${restriction}</li>`
                ).join('')}
              </ul>
            </div>` : ''
          }
          
          <!-- Best Parking Times -->
          ${markerData.details.best_parking_times?.length > 0 ? 
            `<div style="margin-bottom: 16px;">
              <div style="color: #10b981; font-weight: 500; margin-bottom: 6px; font-size: 14px;">⭐ Best Times to Park:</div>
              <ul style="margin: 0; padding-left: 20px; color: #e5e7eb; font-size: 13px; line-height: 1.4;">
                ${markerData.details.best_parking_times.map(time => 
                  `<li style="margin: 4px 0;">${time}</li>`
                ).join('')}
              </ul>
            </div>` : ''
          }
          
          <!-- Peak Infraction Times -->
          ${markerData.details.peak_infraction_times?.length > 0 ? 
            `<div style="margin-bottom: 16px;">
              <div style="color: #ef4444; font-weight: 500; margin-bottom: 6px; font-size: 14px;">⚠️ High Risk Times:</div>
              <ul style="margin: 0; padding-left: 20px; color: #e5e7eb; font-size: 13px; line-height: 1.4;">
                ${markerData.details.peak_infraction_times.map(time => 
                  `<li style="margin: 4px 0;">${time}</li>`
                ).join('')}
              </ul>
            </div>` : ''
          }
          
          <!-- All Recommendations -->
          ${markerData.recommendations && markerData.recommendations.length > 0 ? 
            `<div style="margin-top: 20px; border-top: 1px solid #374151; padding-top: 16px;">
              <div style="color: #60a5fa; font-weight: 600; margin-bottom: 10px; font-size: 15px;">📋 Recommendations:</div>
              <ul style="
                margin: 0; 
                padding-left: 20px; 
                color: #e5e7eb;
                font-size: 13px;
                line-height: 1.5;
              ">
                ${markerData.recommendations
                  .filter(rec => {
                    // Filter out common violation warnings for moderate/risky locations
                    if ((markerData.safety_level === 'moderate' || markerData.safety_level === 'risky') && 
                        rec.includes('Common violation:')) {
                      return false;
                    }
                    return true;
                  })
                  .map(rec => 
                    `<li style="margin: 6px 0;">${rec}</li>`
                  ).join('')}
              </ul>
            </div>` : ''
          }
          
          <!-- Payment Methods -->
          ${markerData.details.street_parking_analysis?.payment_methods?.length > 0 ? 
            `<div style="margin-top: 16px;">
              <div style="color: #9ca3af; font-weight: 500; margin-bottom: 6px; font-size: 14px;">💳 Payment Methods:</div>
              <div style="color: #e5e7eb; font-size: 13px;">
                ${markerData.details.street_parking_analysis.payment_methods.join(', ')}
              </div>
            </div>` : ''
          }
          
          <!-- Accessibility -->
          ${markerData.details.parking_lots_analysis?.accessibility?.length > 0 ? 
            `<div style="margin-top: 16px;">
              <div style="color: #10b981; font-weight: 500; margin-bottom: 6px; font-size: 14px;">♿ Accessible Parking:</div>
              <ul style="margin: 0; padding-left: 20px; color: #e5e7eb; font-size: 13px; line-height: 1.4;">
                ${markerData.details.parking_lots_analysis.accessibility.map(lot => 
                  `<li style="margin: 4px 0;">${lot}</li>`
                ).join('')}
              </ul>
            </div>` : ''
          }
        </div>
      `,
      position: position
    })
    
    infoWindow.open(mapInstance)
    
    // Add click listener to close info window when clicking outside
    const clickListener = mapInstance.addListener('click', () => {
      infoWindow.close()
      google.maps.event.removeListener(clickListener)
    })
    
    // Add custom CSS to override Google Maps info window styling
    const style = document.createElement('style')
    style.textContent = `
      .gm-style .gm-style-iw-c {
        background: #111827 !important;
        border: 1px solid #374151 !important;
        border-radius: 12px !important;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5) !important;
        padding: 0 !important;
      }
      .gm-style .gm-style-iw-d {
        background: #111827 !important;
        border-radius: 12px !important;
        overflow: hidden !important;
        padding: 0 !important;
        border: none !important;
        border-top: none !important;
      }
      .gm-style .gm-style-iw-t::after {
        background: #111827 !important;
        border: 1px solid #374151 !important;
      }
      .gm-style .gm-style-iw-tc::after {
        background: #111827 !important;
        border: 1px solid #374151 !important;
        content: "" !important;
        position: absolute !important;
        top: -8px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        width: 0 !important;
        height: 0 !important;
        border-left: 8px solid transparent !important;
        border-right: 8px solid transparent !important;
        border-top: 8px solid #111827 !important;
        border-bottom: none !important;
      }
      .gm-style .gm-style-iw-tc {
        background: transparent !important;
        position: relative !important;
        height: 8px !important;
        width: 100% !important;
      }
      .gm-style .gm-style-iw-c button {
        background: transparent !important;
        border: none !important;
        cursor: pointer !important;
        padding: 0 !important;
        border-radius: 4px !important;
        transition: all 0.2s !important;
        position: absolute !important;
        top: 4.5px !important;
        right: 4.5px !important;
        z-index: 1000 !important;
        width: 18px !important;
        height: 18px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        opacity: 1 !important;
      }
      .gm-style .gm-style-iw-ch {
        display: none !important;
      }
      .gm-style .gm-style-iw-c button:hover {
        background: rgba(255, 255, 255, 0.1) !important;
      }
      .gm-style .gm-style-iw-c button img {
        display: none !important;
      }
      .gm-style .gm-style-iw-c button::before {
        content: "✕" !important;
        color: #9ca3af !important;
        font-size: 15px !important;
        font-weight: bold !important;
        line-height: 1 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        height: 100% !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
      }
      .gm-style .gm-style-iw-c button:hover::before {
        color: #e5e7eb !important;
      }
      .gm-style .gm-style-iw-c::-webkit-scrollbar {
        display: none !important;
      }
      .gm-style .gm-style-iw-d::-webkit-scrollbar {
        display: none !important;
      }
      .gm-style .gm-style-iw-c {
        -ms-overflow-style: none !important;
        scrollbar-width: none !important;
      }
      .gm-style .gm-style-iw-d {
        -ms-overflow-style: none !important;
        scrollbar-width: none !important;
      }
    `
    document.head.appendChild(style)
  }

  const showUserLocationInfo = (mapInstance: google.maps.Map, position: google.maps.LatLngLiteral) => {
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="
          max-width: 320px; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #e5e7eb;
          background: #111827;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        ">
          <h3 style="
            margin: 0 0 12px 0; 
            color: #ffffff; 
            font-size: 18px; 
            font-weight: 600;
            line-height: 1.4;
          ">Your Location</h3>
          
          <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <span style="color: #9ca3af; font-weight: 500;">Latitude:</span>
            <span style="color: #e5e7eb; font-weight: 600;">${position.lat.toFixed(6)}</span>
          </div>
          
          <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <span style="color: #9ca3af; font-weight: 500;">Longitude:</span>
            <span style="color: #e5e7eb; font-weight: 600;">${position.lng.toFixed(6)}</span>
          </div>
        </div>
      `,
      position: position
    })
    
    infoWindow.open(mapInstance)
  }

  const getSafetyColor = (level: string): string => {
    switch (level.toLowerCase()) {
      case 'safe': return '#22c55e'
      case 'moderate': return '#f97316'
      case 'risky': return '#ef4444'
      default: return '#6b7280'
    }
  }

  if (loading) {
    return (
      <div className="w-full h-[600px] bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-600 border-t-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading safety data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-[600px] bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
        <div className="text-red-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Error Loading Safety Data</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button 
          onClick={() => {
            mapInitializedRef.current = false
            fetchSafetyData()
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-6 p-6 bg-gray-900/50 border border-gray-800 rounded-xl backdrop-blur-sm">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent mb-3">
          Waterloo Parking Safety Map
        </h2>
        <p className="text-gray-400 text-base mb-4">
          Showing {markers.length} parking locations with safety analysis
        </p>
        <div className="flex flex-wrap gap-6 text-sm">
          <span className="flex items-center gap-2 text-gray-300">
            <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
            <span className="font-medium">Safe</span>
          </span>
          <span className="flex items-center gap-2 text-gray-300">
            <div className="w-4 h-4 bg-orange-500 rounded-full shadow-lg"></div>
            <span className="font-medium">Moderate</span>
          </span>
          <span className="flex items-center gap-2 text-gray-300">
            <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg"></div>
            <span className="font-medium">Risky</span>
          </span>
          <span className="flex items-center gap-2 text-gray-300">
            <div className="w-4 h-4 bg-gray-500 rounded-full shadow-lg"></div>
            <span className="font-medium">Unknown</span>
          </span>
        </div>
      </div>
      
      {/* Map container */}
      <div 
        ref={mapRef}
        className="w-full h-[600px] rounded-xl overflow-hidden border border-gray-800"
        id="map"
      />
    </div>
  )
} 