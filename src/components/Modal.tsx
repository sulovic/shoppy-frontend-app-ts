const Modal = ({ onOK, onCancel, title = "", question = "" }: { onOK: () => void; onCancel: () => void; title?: string; question?: string }) => {
  return (
    <div className="relative z-10">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="relative p-4 transform w-full max-w-xl overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:p-8">
            <div className="w-full sm:mt-0 py-4">
              <div className="text-left">
                <h5>{title}</h5>
                <div className="my-4 w-full h-0.5 bg-zinc-400"></div>
                <div className="my-2">
                  <p>{question}</p>
                </div>
                <div className="my-4 w-full h-0.5 bg-zinc-400"></div>
              </div>
            </div>
            <div className="gap-2 flex flex-row-reverse">
              <button type="button" className="button button-sky" onClick={onOK}>
                OK
              </button>
              <button type="button" className="button button-gray" onClick={onCancel}>
                Odustani
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
