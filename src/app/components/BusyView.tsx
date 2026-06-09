import { BUSY_MESSAGE } from "../utils/types";

export default function BusyView() {
  return (
    <div className="flex min-h-[40vh] flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6">
      <span className="mb-6 text-2xl text-white" aria-hidden="true">
        ☠
      </span>
      <p className="max-w-md text-center text-sm leading-relaxed text-[#52525b]">
        {BUSY_MESSAGE}
      </p>
    </div>
  );
}
