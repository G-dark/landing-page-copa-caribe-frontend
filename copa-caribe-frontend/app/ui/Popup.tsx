function Popup({ isOpen, onClose, children }: { isOpen:boolean, onClose:any, children: React.ReactNode } ) {
    if (!isOpen) return null;
    return <div className="fixed bottom-5 right-5">
      <div className="bg-blue-500 p-5 rounded-lg max-w-[500px] w-full shadow-md relative opacity-100 transition-opacity duration-1000 ease-in-out">
      <button className="absolute top-2 right-2 bg-none border-none cursor-pointer text-sm" onClick={onClose}>
            &times;
          </button>
          {children}
      </div>
    </div>;
  }

  export default Popup;