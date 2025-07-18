type ButtonProps = {
    onClick: () => void;
    label: string;
    className?: string;
};

const Button = ({ onClick, label, className }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={ className}
        >
            {label}
        </button>
    );
};

export default Button;