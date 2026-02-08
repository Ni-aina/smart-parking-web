"use client";

import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  User,
  Eye,
  Edit,
  Trash2,
  Clock,
  CarFront
} from 'lucide-react';
import { ReservationInterface } from '@/types/reservation';
import { useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { getDateFormat, getTimeFormat } from '@/utils/DateTimeAction';

interface Props {
  reservation: ReservationInterface;
  onCancel?: (id: string) => void;
}

const ReservationCard = ({ reservation, onCancel }: Props) => {
  const [loadingImage, setLoadingImage] = useState(true);

  const {
    id,
    lot: {
      name,
      location,
      pricePerHour,
      urlImages,
      lotType: {
        vehicleType = ""
      }
    },
    vehicle: {
      plateNumber
    },
    driver: {
      fullName
    },
    status,
    startTime: startTimeStr
  } = reservation;

  const dateTimeStart = new Date(startTimeStr);
  const startDate = getDateFormat(dateTimeStart);
  const startTime = getTimeFormat(dateTimeStart);

  const imageSrc = urlImages?.[0] || '/images/default-parking.jpg';

  return (
    <div className="flex flex-col bg-white/2.5 rounded-md p-4 text-white gap-3">
      <div className="flex items-center justify-between gap-3">
        <h1
          className={
            `text-xs font-medium capitalize p-2 rounded-full bg-white/5
            ${status === 'active' && 'text-green-500/70' ||
            status === 'pending' && 'text-blue-500/70' ||
            status === 'cancelled' && 'text-red-500/70' ||
            'text-white'
            }`
          }
        >
          {status}
        </h1>
        <div className="flex items-center">
          <Link
            href={`#`}
            className="text-yellow-500 hover:bg-yellow-500/10 p-2 rounded"
            aria-label="View reservation details">
            <Eye
              size={18}
            />
          </Link>
          <Link
            href={`#`}
            className="text-green-500 hover:bg-yellow-500/10 p-2 rounded"
            aria-label="View reservation details">
            <Edit
              size={18}
            />
          </Link>
          <button
            type="button"
            onClick={() => onCancel?.(id)}
            className="text-red-500 hover:bg-red-500/10 p-2 rounded cursor-pointer"
            aria-label="Cancel reservation"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <div className="mt-2 flex gap-4 overflow-hidden">
        {
          loadingImage &&
          <Skeleton
            className="flex-shrink-0 w-28 h-20 bg-white/5"
          />
        }
        <div
          className={
            `
              relative flex-shrink-0 rounded-md overflow-hidden
              ${loadingImage ? "w-0 h-0" : "w-28 h-20"}
            `
          }
        >
          <Image
            src={imageSrc}
            alt={name || 'Parking Lot Image'}
            fill
            className="object-cover"
            onLoadStart={
              () => setLoadingImage(true)
            }
            onLoadingComplete={
              () => setLoadingImage(false)
            }
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between gap-3">
            <div className="w-20 font-semibold truncate">
              {name || '—'}
            </div>
            <div className="flex-1">
              ${pricePerHour || 'N/A'} / hour
            </div>
          </div>
          <p className="text-sm text-white/60 truncate mt-1">
            {location || '—'}
          </p>
          <span className="text-sm text-white/70">
            {vehicleType || '—'}
          </span>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-3 text-sm text-white/70">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User size={16} className="text-white/60" />
            <div className="truncate">
              {fullName}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CarFront size={16} className="text-white/60" />
            <div className="truncate">
              {plateNumber}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-end gap-2">
            <div className="truncate">
              {startDate}
            </div>
            <Calendar size={16} className="text-white/60" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <div className="truncate">
              {startTime}
            </div>
            <Clock size={16} className="text-white/60" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReservationCard
