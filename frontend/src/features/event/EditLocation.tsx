import { LatLngTuple, Map } from 'leaflet'
import React, { RefObject, useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMapEvent } from 'react-leaflet'

/**
 * When longitude is given out of the range <-180, 180>,
 * this function moves it back into the range (to the same place on globe)
 * @param {number} lng - longitude
 * @returns {number} - normalized longitude
 */
const normalizeLongitude = (lng: number) =>
  (((lng % 360) - 180 * 3) % 360) + 180

type ChangeLocationEvent = (event: {
  target: {
    value: LatLngTuple
  }
}) => void

const LocationDrag = ({ onDrag }: { onDrag: ChangeLocationEvent }) => {
  const map = useMapEvent('drag', () => {
    const { lat, lng } = map.getCenter()
    onDrag({ target: { value: [lat, normalizeLongitude(lng)] } })
    map.setView([lat, normalizeLongitude(lng)])
  })

  return null
}

const CurrentLocation = ({
  onLocationFound,
}: {
  onLocationFound: ChangeLocationEvent
}) => {
  const map = useMapEvent('locationfound', e => {
    const { lat, lng } = e.latlng
    onLocationFound({ target: { value: [lat, lng] } })
    map.flyTo([lat, normalizeLongitude(lng)])
  })
  return null
}

interface IEditLocation {
  className?: string
  value?: LatLngTuple
  onChange?: ChangeLocationEvent
}

/**
 * The component works similarly to an input component:
 * it has value and onChange
 * @param {[number, number]} value - gps coordinates
 * @param {({ target: { value: [number, number] }}) => void} onChange - gets called when coordinates change
 */
const EditLocation: React.FC<IEditLocation> = ({
  value = [50, 15], // initial location somewhere in Bohemia, can be changed or made dynamic somehow
  className = '',
  onChange = () => null,
}) => {
  value = [value?.[0] ?? 50, value?.[1] ?? 15] // initial location somewhere in Bohemia, can be changed or made dynamic somehow
  const [map, setMap] = useState<Map>()

  // when the map becomes visible, we need to invalidate its size so it displays tiles properly
  // https://stackoverflow.com/a/42205939
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useOnScreen(ref)
  useEffect(() => {
    if (isVisible) map?.invalidateSize()
  }, [map, isVisible])

  useEffect(() => {
    if (map) {
      map.setView(value)
    }
  }, [value, map])

  return (
    <div ref={ref} className="flex flex-col w-56">
      <section className="bg-yellow-200 p-2 text-sm italic">
        přetáhni mapu do nového místa nebo{' '}
        <button
          className="bg-yellow-50"
          type="button"
          onClick={() => map?.locate()}
        >
          najdi kde jsi
        </button>
      </section>

      <MapContainer
        attributionControl={false}
        center={value}
        zoom={12}
        scrollWheelZoom="center"
        doubleClickZoom="center"
        touchZoom="center"
        className={className}
        whenCreated={setMap}
      >
        <CurrentLocation onLocationFound={onChange} />
        <LocationDrag onDrag={onChange} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={value} />
      </MapContainer>
    </div>
  )
}

export default EditLocation

/**
 * https://stackoverflow.com/a/65008608
 */
function useOnScreen(ref: RefObject<HTMLDivElement>) {
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting),
    )

    if (ref.current) observer.observe(ref.current)
    // Remove the observer as soon as the component is unmounted
    return () => {
      observer.disconnect()
    }
  }, [ref])

  return isIntersecting
}
