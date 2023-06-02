'use client'
import { useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import clsx from 'clsx'
import { add, differenceInMilliseconds, differenceInMinutes, format, isEqual, startOfWeek, sub } from 'date-fns'
import { ptBR as ptBRLocale } from 'date-fns/locale'
import { CreateAvailableTimeModal } from "@/components/modals/CreateAvailableTimeModal";

const stateEvent = [
  {
    id: 1,
    start: new Date("May 8, 2023 16:30:00"),
    end: new Date("May 8, 2023 20:00:00"),
    name: 'task tal'
  },
  {
    id: 2,
    start: new Date("May 11, 2023 12:30:00"),
    end: new Date("May 11, 2023 18:00:00"),
    name: 'task tal'
  },
  {
    id: 3,
    start: new Date("May 10, 2023 11:30:00"),
    end: new Date("May 10, 2023 13:30:00"),
    name: 'task tal'
  }
]

export default function Home<NextPage>() {
  const [selectedWeek, setSelectedWeek] = useState(startOfWeek(new Date('May 10, 2023 03:24:00')))
  const [hours, setHours] = useState([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22])
  const [days, setDays] = useState([
    add(selectedWeek, { days: 0 }),
    add(selectedWeek, { days: 1 }),
    add(selectedWeek, { days: 2 }),
    add(selectedWeek, { days: 3 }),
    add(selectedWeek, { days: 4 }),
    add(selectedWeek, { days: 5 }),
    add(selectedWeek, { days: 6 }),
  ])
  const [events, setEvents] = useState(stateEvent)
  const [openCreateAvailableTimeModal, setOpenCreateAvailableTimeModal] = useState(false)
  const [draggingEventId, setDraggingEventId] = useState<any>({})



  const availableHours = [
    {
      start: new Date("May 8, 2023 13:00:00"),
      end: new Date("May 8, 2023 20:00:00"),
    },
    {
      start: new Date("May 9, 2023 9:00:00"),
      end: new Date("May 9, 2023 13:00:00"),
    },
    {
      start: new Date("May 10, 2023 10:00:00"),
      end: new Date("May 10, 2023 14:00:00"),
    },
    {
      start: new Date("May 10, 2023 17:00:00"),
      end: new Date("May 10, 2023 21:00:00"),
    },
    {
      start: new Date("May 11, 2023 11:00:00"),
      end: new Date("May 11, 2023 20:00:00"),
    },
    {
      start: new Date("May 12, 2023 08:00:00"),
      end: new Date("May 12, 2023 20:00:00"),
    },
  ]

  const handleDragEnter = (e: any, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingEventId(id)
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.style.backgroundColor = 'red'
  };

  const handleDragOver = (e: any, now: any) => {
    e.preventDefault();
    e.stopPropagation();
    const newEvents = events.map((event) => {
      if (event.id === draggingEventId) {
        const eventDuration = differenceInMinutes(event.end, event.start)

        const newEnd = new Date(add(now, { minutes: eventDuration }))
        const newStart = new Date(now)

        return { ...event, start: newStart, end: newEnd };
      }
      return event;
    });
    setEvents(newEvents)
  };
  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingEventId({})
  };

  return (
    <>
      <Head>
        <title>Dev Calendar</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Dev Calendar</h1>
      <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <div className="text-4xl">
          Semana
        </div>
        <div className="grid grid-flow-col grid-cols-7 w-full justify-evenly">
          {days.map((day, dayIndex) => {
            return (
              <div className="grid bg-slate-500" key={dayIndex}>
                <div>{format(day, 'E', { locale: ptBRLocale })}</div>
                {hours.map((hour, index) => {
                  const now = add(selectedWeek, { days: dayIndex, hours: hour })
                  const [event] = events.filter(event => new Date(event.start) <= add(new Date(now), { minutes: 59 }) && sub(new Date(event.end), { minutes: 1 }) > new Date(now))
                  const { isEventStart, isEventEnd, timeInElement } = findIfIsInEvent(event?.start, event?.end, now)

                  const eventHeight = findEventHeight(isEventStart, isEventEnd, timeInElement)
                  if (event) {
                    return (
                      <div
                        key={index}
                        className={clsx(
                          "w-[98%] h-12 bg-slate-400 text-black text-left",
                          `h-${eventHeight}`,
                          isEventStart && 'rounded-t-lg',
                          isEventEnd && 'rounded-b-lg',
                          isEventStart && (eventHeight < 12) && `mt-${12 - eventHeight}`,
                          isEventEnd && (eventHeight < 12) && `mb-${12 - eventHeight}`,
                        )}
                        draggable
                        onDragOver={e => handleDragOver(e, now)}
                        onDragEnter={e => handleDragEnter(e, event.id)}
                        onDrop={e => handleDrop(e)}
                      >
                        {!!isEventStart && event?.name}
                      </div>
                    )
                  }

                  return (
                    // blank hour
                    <div
                      key={index}
                      className="h-12 bg-slate-500 text-black text-center border border-black border-opacity-20"
                      onDragOver={e => handleDragOver(e, now)}
                      onDragLeave={e => handleDragLeave(e)}
                    >
                      <p>{format(new Date(now), 'HH')}</p>
                    </div>
                  )

                })}
              </div>
            )
          }
          )}
        </div>
      </main>
      <CreateAvailableTimeModal open={openCreateAvailableTimeModal} onOpenChange={setOpenCreateAvailableTimeModal} />
    </>
  );
};

const findEventHeight = (isStart: any, isEnd: any, inElementTime: any) => {
  return inElementTime / 5
}

const findIfIsInEvent = (eventStart: any, eventEnd: any, now: any) => {
  if (eventStart || eventEnd) {
    let timeInElement
    const diffToStart = differenceInMinutes(new Date(eventStart), new Date(now)) ?? 0
    const diffToEnd = differenceInMinutes(new Date(eventEnd), new Date(now)) ?? 0
    const isEventStart = format(new Date(eventStart), 'HH') === format(add(new Date(now), { minutes: 59 }), 'HH')|| (diffToStart > -60 && diffToStart > 0)
    const isEventEnd = format(new Date(eventEnd), 'HH') === format(add(new Date(now), { minutes: 1 }), 'HH') || diffToEnd <= 60

    console.log(isEventStart, diffToStart, new Date(now));
    if (isEventEnd) {
      timeInElement = Math.abs(diffToEnd)
    }

    if (isEventStart) {
      timeInElement = Math.abs(diffToStart)
    }

    return {
      isEventStart,
      isEventEnd,
      timeInElement
    }
  }

  return {
    isEventStart: false,
    isEventEnd: false,
    timeInElement: 0
  }
}