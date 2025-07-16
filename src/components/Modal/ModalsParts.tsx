export function ModalHeader({ title, onClose }: { title: string, onClose: () => void }) {
    return (
        <div className="px-6 py-4 border-b flex justify-between items-center bg-[#091127] text-white">
            <h2 className="text-[32px] font-semibold">{title}</h2>
            <button onClick={onClose} className="text-gray-300 cursor-pointer">✕</button>
        </div>
    )
}

export function ModalBody({ children }: { children: React.ReactNode }) {
    return <div className="p-6 bg-[#091127]">{children}</div>
}
export function ModalFooter({ children }: { children: React.ReactNode }) {
    return <div className="bg-[#091127] px-6 py-4 border-t flex justify-end gap-2">{children}</div>
}