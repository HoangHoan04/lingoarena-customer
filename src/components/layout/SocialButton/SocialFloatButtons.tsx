import { useState } from "react";
import MessengerFloatButton from "./MessengerFloatButton";
import ZaloFloatButton from "./ZaloFloatButton";
import { Button } from "primereact/button";

export default function SocialFloatButtons() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center cursor-pointer">
      <div
        className={`flex flex-col items-center gap-3 mb-3 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto max-h-40"
            : "opacity-0 translate-y-4 pointer-events-none max-h-0"
        }`}
      >
        <MessengerFloatButton />
        <ZaloFloatButton />
      </div>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen
            ? "border-2 border-red-500 rotate-45 text-red-500 bg-red-200"
            : "bg-blue-600 rotate-0 text-white"
        }`}
        aria-label="Toggle Social Buttons"
        icon={isOpen ? "pi pi-plus" : "pi pi-comments"}
        pt={{
          root: {
            className: `
                !border-none !shadow-none !ring-0 !outline-none 
                !focus:ring-0 !focus:outline-none !focus:border-none
                transition-all! duration-300! active:scale-90!
                w-12! h-12! flex! items-center! justify-center!
                cursor-pointer! rounded-full! shadow-lg! transition-all! duration-300! active:scale-90!
              `,
          },
          icon: {
            className: `text-xl! text-black-400! opacity-80! group-hover:opacity-100!`,
          },
        }}
        tooltip="Liên hệ"
        tooltipOptions={{
          position: "left",
          mouseTrack: true,
          mouseTrackTop: 15,
          mouseTrackLeft: 15,
        }}
      />

      {isOpen && (
        <div
          className="fixed inset-0 z-[-1] bg-transparent"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
