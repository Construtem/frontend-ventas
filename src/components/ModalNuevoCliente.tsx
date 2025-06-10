import React, { useEffect, useRef, useState } from 'react';

/**
 * ModalNuevoCliente ‑ Tailwind version
 * Props:
 *  - isOpen   : boolean
 *  - onClose  : () => void
 *  - onSave   : (form) => void
 */
export interface ClienteForm {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (form: ClienteForm) => void;
}

const initialForm: ClienteForm = {
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
};

const ModalNuevoCliente: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
    const [form, setForm] = useState<ClienteForm>(initialForm);
    const [touched, setTouched] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    // cierra con ESC / clic fuera
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        const handleClick = (e: MouseEvent) =>
            !modalRef.current?.contains(e.target as Node) && onClose();
        if (isOpen) {
            document.addEventListener('keydown', handleKey);
            document.addEventListener('mousedown', handleClick);
        }
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.removeEventListener('mousedown', handleClick);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const change = (k: keyof ClienteForm) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setForm({ ...form, [k]: e.target.value });

    const guardar = () => {
        setTouched(true);
        if (!form.nombre.trim()) return; // valida campo obligatorio
        onSave(form);
        setForm(initialForm);
        setTouched(false);
    };

    const inputBase =
        'w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div
                ref={modalRef}
                className="w-full max-w-lg bg-white rounded-lg shadow-xl p-6 space-y-5 animate-scaleIn"
            >
                <h2 className="text-xl font-semibold text-gray-800">Nuevo cliente</h2>

                {/* Nombre */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                        className={`${inputBase} ${
                            touched && !form.nombre.trim() ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={form.nombre}
                        onChange={change('nombre')}
                    />
                    {touched && !form.nombre.trim() && (
                        <p className="text-xs text-red-500 mt-1">El nombre es obligatorio.</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                    <input
                        type="email"
                        className={`${inputBase} border-gray-300`}
                        value={form.email}
                        onChange={change('email')}
                    />
                </div>

                {/* Teléfono */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input
                        className={`${inputBase} border-gray-300`}
                        value={form.telefono}
                        onChange={change('telefono')}
                    />
                </div>

                {/* Dirección */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                    <textarea
                        rows={2}
                        className={`${inputBase} border-gray-300 resize-none`}
                        value={form.direccion}
                        onChange={change('direccion')}
                    />
                </div>

                {/* Acciones */}
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={guardar}
                        className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300"
                        disabled={!form.nombre.trim()}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalNuevoCliente;

/*
  Tailwind extra:
  .animate-scaleIn {
    @apply transform scale-95 opacity-0;
    animation: scaleIn .15s ease-out forwards;
  }
  @keyframes scaleIn {
    to { transform: scale(1); opacity: 1; }
  }
*/