'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useLogin } from '@/context/LoginContext'; // Asegúrate de que sea la ruta correcta
import { ADMIN_SideBar, VENDEDOR_SideBar } from '@/config/sideBar'; // Asegúrate de que sea la ruta correcta
import type { NavItem } from '@/config/sideBar';
type Props = {
  open?: boolean; // viene del Header
  // renderItem?: (item: NavItem) => React.ReactNode; // opcional para personalizar el renderizado
};

export default function Sidebar({open = true }: Props) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [hover, setHover] = useState<string | null>(null);

  const toggle = (id: string) =>
      setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const baseItemStyle = (id: string) => {
    const style: React.CSSProperties = {
      ...styles.menuItem,
    };
    if (hover === id) {
      style.backgroundColor = '#444';
      style.color = '#00FF99';
    }
    return style;
  };

  const baseSubItemStyle = (id: string, active: boolean) => {
    const style: React.CSSProperties = {
      ...styles.subMenuItem,
      ...(active ? styles.subMenuItemActive : {}),
    };

    if (hover === id) {
      style.backgroundColor = '#444';
      style.color = '#00FF99';
    } else if (active) {
      style.backgroundColor = 'rgba(0,168,89,0.15)';
      style.color = '#00A859';
    } else {
      style.backgroundColor = 'transparent';
      style.color = '#bdbdbd';
    }

    return style;
  };

  const renderItem = (item: NavItem) => {
    const hasChildren = !!item.children?.length;
      return (
        <div key={item.id}>
          {item.href ? (
              <Link
                  href={item.href}
                  style={baseItemStyle(item.id)}
                  onMouseEnter={() => setHover(item.id)}
                  onMouseLeave={() => setHover(null)}
              >
                {item.icon}
                {open && item.label}
              </Link>
          ) : (
              <div
                  style={baseItemStyle(item.id)}
                  onClick={() => toggle(item.id)}
                  onMouseEnter={() => setHover(item.id)}
                  onMouseLeave={() => setHover(null)}
              >
                {item.icon}
                {open && <span style={{ flex: 1 }}>{item.label}</span>}
                {open && (expanded[item.id] ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />)}
              </div>
          )}

          {hasChildren && expanded[item.id] && open && (
              <div style={styles.subMenu}>
                {item.children!.map((child:NavItem) => {
                  const active = child.href ? pathname.startsWith(child.href) : false;
                  return (
                      <Link
                          key={child.id}
                          href={child.href!}
                          style={baseSubItemStyle(child.id, active)}
                          onMouseEnter={() => setHover(child.id)}
                          onMouseLeave={() => setHover(null)}
                      >
                        {child.label}
                      </Link>
                  );
                })}
              </div>
          )}
        </div>
    );
  };

    const { usuario } = useLogin();

    if (!usuario) return null;
    const nav = usuario.rol === 'vendedor' ? VENDEDOR_SideBar : ADMIN_SideBar;
    console.log(usuario)
  return (
      <aside
          style={{
            ...styles.sidebar,
            width: open ? '180px' : '60px',
            transition: 'width 0.3s',
            overflowX: 'hidden',
          }}
      >
        {nav.map(renderItem)}
      </aside>
  );
}

const styles: {
  sidebar: React.CSSProperties;
  menuItem: React.CSSProperties;
  subMenu: React.CSSProperties;
  subMenuItem: React.CSSProperties;
  subMenuItemActive: React.CSSProperties;
} = {
  sidebar: {
    height: '100vh',
    backgroundColor: '#2f2f2f',
    color: 'white',
    paddingTop: '90px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '15px 20px',
    cursor: 'pointer',
    fontSize: '15px',
    userSelect: 'none',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'background-color 0.2s, color 0.2s',
  },
  subMenu: {
    paddingLeft: '30px',
    display: 'flex',
    flexDirection: 'column',
  },
  subMenuItem: {
    padding: '8px 12px',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#bdbdbd',
    textDecoration: 'none',
    transition: 'background-color 0.2s, color 0.2s',
    borderRadius: '4px',
  },
  subMenuItemActive: {
    fontWeight: 'bold',
    color: '#00a859',
  },
};
