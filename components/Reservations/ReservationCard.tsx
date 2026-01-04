"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, Eye, Trash2 } from 'lucide-react'
import { ReservationInterface } from '@/types/reservation'

interface Props {
  reservation: ReservationInterface
  onCancel?: (id: string) => void
}

const ReservationCard = ({ reservation, onCancel }: Props) => {
  const start = new Date(reservation.startTime).toLocaleString();
  const imageSrc = reservation.lot.urlImages?.[0] || '/images/default-parking.png';

  return (
    <div className="flex flex-col bg-white/2.5 rounded-md p-4 text-white gap-3">
      <div className="flex items-center justify-between gap-3">
        <h1
          className={
            `text-xs font-medium capitalize p-2 rounded-full bg-white/5
            ${reservation.status === 'active' && 'text-green-500/70' ||
            reservation.status === 'pending' && 'text-blue-500/70' ||
            reservation.status === 'cancelled' && 'text-red-500/70' ||
            'text-white'
            }`
          }
        >
          {reservation.status}
        </h1>
        <div className="flex items-center gap-1">
          <Link
            href={`#`}
            className="text-yellow-500 hover:bg-yellow-500/10 p-2 rounded"
            aria-label="View reservation details">
            <Eye
              size={18}
            />
          </Link>
          <button
            type="button"
            onClick={() => onCancel?.(reservation.id)}
            className="text-red-500 hover:bg-red-500/10 p-2 rounded"
            aria-label="Cancel reservation"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <div className="mt-2 flex gap-4 overflow-hidden">
        <div className="relative w-28 h-20 flex-shrink-0 rounded-md overflow-hidden bg-neutral-900">
          <Image
            src={imageSrc}
            alt={reservation.lot.name || 'Parking Lot Image'}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold truncate">
              {reservation.lot.name || '—'}
            </h3>
            <h1 className="text-white text-end">
              ${reservation.lot.pricePerHour || 'N/A'} / hour
            </h1>
          </div>
          <p className="text-sm text-white/60 truncate mt-1">
            {reservation.lot.location || '—'}
          </p>
          <span className="text-sm text-white/70">
            {reservation.lot.lotType?.vehicleType || '—'}
          </span>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-3 text-sm text-white/70">
        <div className="flex items-center gap-2">
          <User size={16} className="text-white/60" />
          <div className="truncate">
            {reservation.driver.fullName}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Calendar size={16} className="text-white/60" />
          <div className="truncate">
            {start}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReservationCard
