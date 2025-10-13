import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Modal from "../../../components/Modal";
import moment from "moment";
import "moment/locale/sr";
import "react-big-calendar/lib/css/react-big-calendar.css";
moment.locale("sr");

type Odsustvo = {
  id?: string;
  start?: string | Date;
  end?: string | Date;
  vrstaOdsustva?: string;
  user?: string;
  brojDana?: number;
};

const Kalendar: React.FC<{ odsustva?: Odsustvo[] }> = ({ odsustva = [] }) => {
  const [selectedOdsustvo, setSelectedOdsustvo] = useState<Odsustvo | null>(null);
  const [showModal, setShowModal] = useState(false);

  const localizer = momentLocalizer(moment as any);

  const formattedOdsustva = (odsustva || []).map((odsustvo) => ({
    ...odsustvo,
    start: new Date((odsustvo.start as string) || new Date()),
    end: new Date((odsustvo.end as string) || new Date()),
  }));

  const eventPropGetter = (event: any) => {
    const getColor = (vrstaOdsustva: string) => {
      switch (vrstaOdsustva) {
        case "GODISNJI_ODMOR":
          return "#22d3ee";
        case "PLACENO_ODSUSTVO":
          return "#60a5fa";
        case "SLUZBENI_PUT_U_ZEMLJI":
          return "#34d399";
        case "SLUZBENI_PUT_U_INOSTRANSTVO":
          return "#a3e635";
        default:
          return "#22d3ee";
      }
    };
    const backgroundColor = getColor(event.vrstaOdsustva);
    return { style: { backgroundColor } } as any;
  };

  const messages = {
    allDay: "Ceo dan",
    previous: "Nazad",
    next: "Napred",
    today: "Danas",
    month: "Mesec",
    week: "Nedelja",
    day: "Dan",
    agenda: "Dnevni red",
    date: "Datum",
    time: "Vreme",
    event: "Događaj",
    noEventsInRange: "Nema događaja u ovom opsegu.",
    showMore: (total: number) => `+ još ${total}`,
  } as any;

  const handleOpenModal = (event: any) => {
    setSelectedOdsustvo(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedOdsustvo(null);
    setShowModal(false);
  };

  return (
    <div className="min-w-3xl flex-grow rounded-xl border-2 border-solid border-zinc-100 bg-gray-100 shadow-sm p-4 dark:bg-gray-800">
      <h3 className="text-center ">Evidencija odsustva</h3>
      <Calendar
        localizer={localizer}
        events={formattedOdsustva}
        startAccessor="start"
        endAccessor="end"
        titleAccessor={(event: any) => event.vrstaOdsustva + " - " + event.user}
        style={{ height: 700 }}
        messages={messages}
        onSelectEvent={handleOpenModal}
        eventPropGetter={eventPropGetter}
      />
      {showModal && (
        <Modal
          onOK={handleCloseModal}
          onCancel={handleCloseModal}
          title="Pregled odsustva"
          // casting JSX to any because Modal question prop expects string in original project
          question={(
            <>
              <div>Pregled odabranog odsustva: {selectedOdsustvo?.user}</div>
              <div>
                Vrsta odsustva: {selectedOdsustvo?.vrstaOdsustva} - {selectedOdsustvo?.brojDana} dana
              </div>
              <div>
                Period odsustva: {selectedOdsustvo?.start ? (selectedOdsustvo?.start as Date).toLocaleDateString() : ""} do {selectedOdsustvo?.end ? (selectedOdsustvo?.end as Date).toLocaleDateString() : ""}
              </div>
            </>
          ) as any}
        />
      )}
    </div>
  );
};

export default Kalendar;
