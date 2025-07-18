type ButtonProps = {
    onClick: () => void;
    label: string;
    className?: string;
};

const Button = ({ onClick, label, className }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={ `font-bold ${className} rounded-[6px] shadow-[0_1px_3px_0.4px_rgba(0,0,0,0.25)]
shadow-[0_1px_3px_0.4px_rgba(0,0,0,0.25)]
shadow-[0_1px_3px_0.4px_rgba(0,0,0,0.25)]
shadow-[0_1px_3px_0.4px_rgba(0,0,0,0.25)]
py-[8px] px-[16px] cursor-pointer
`}
        >
            {label}
        </button>
    );
};

export default Button;