type ButtonProps = {
    onClick: () => void;
    label: string;
    className?: string;
    disabled?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>; // Permite props adicionales

const Button = ({ onClick, label, className, disabled, ...rest }: ButtonProps) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={ `font-bold ${className} rounded-[6px] shadow-[0_1px_3px_0.4px_rgba(0,0,0,0.25)]
shadow-[0_1px_3px_0.4px_rgba(0,0,0,0.25)]
shadow-[0_1px_3px_0.4px_rgba(0,0,0,0.25)]
shadow-[0_1px_3px_0.4px_rgba(0,0,0,0.25)]
py-[8px] px-[16px] cursor-pointer
`}
            {...rest} // Pasa props adicionales al elemento button
        >
            {label}
        </button>
    );
};

export default Button;