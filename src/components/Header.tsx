'use client';
import Image from 'next/image';
import logo from '@/styles/images/contrutem.png';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {

  return (
      <header className="fixed top-0 left-0 w-full h-[58px] bg-[#2D2D2D] text-white flex items-center justify-between px-8 shadow-md z-50">
        <div className="flex items-center h-full">
          {onToggleSidebar && (
              <button onClick={onToggleSidebar} className={'cursor-pointer'}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FF7300"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                  <path d="M6 21a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3zm12 -16h-8v14h8a1 1 0 0 0 1 -1v-12a1 1 0 0 0 -1 -1" />
                </svg>
              </button>
          )}
          <div className="flex items-center w-[140px] ml-4">
          <Image src={logo} alt="ConstrUTEM Logo" className="max-h-20 pl-4 object-contain" />
          </div>
        </div>
      </header>
  );
};

export default Header;
