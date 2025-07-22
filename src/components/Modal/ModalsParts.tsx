

export function ModalHeader({ title, onClose, className }: { title: string, onClose: () => void, className?: string }) {
    return (
        <div className={`px-6 py-4 border-b flex justify-between items-center bg-[#091127] text-white ${className}`}>
            <h2 className="text-[32px] font-semibold">{title}</h2>
            <button onClick={onClose} className="text-gray-300 cursor-pointer">✕</button>
        </div>
    )
}

export function ModalBody({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={`p-6 bg-white overflow-auto ${className}`}>{children}</div>
}
export function ModalFooter({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={`px-6 py-4 border-t flex justify-end gap-2 ${className}`}>{children}</div>
}