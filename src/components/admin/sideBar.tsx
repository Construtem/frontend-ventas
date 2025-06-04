'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import type { NavItem } from '@/config/nav';   // mismo contrato que antes


/* ----------  componente ---------- */
type Props = { nav: NavItem[] };

export default function Sidebar({ nav }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [hover, setHover] = useState<string | null>(null);

  const toggle = (id: string) =>
      setOpen((s) => ({ ...s, [id]: !s[id] }));

  /* ---------- ITEM DE PRIMER NIVEL ---------- */
  const baseItemStyle = (id: string, active: boolean) => {
    // 1. copia base + variante activa
    const style: React.CSSProperties = {
      ...styles.menuItem,
      ...(active ? styles.menuItemActive : {}),
    };

    // 2. overrides según hover / activo
    if (hover === id) {
      style.backgroundColor = '#444';
      style.color = '#00FF99';
    }

    return style;
  };

  /* ---------- SUBITEM ---------- */
  const baseSubItemStyle = (id: string, active: boolean) => {
    const style: React.CSSProperties = {
      ...styles.subMenuItem,
      ...(active ? styles.subMenuItemActive : {}),
    };

    if (hover === id) {
      style.backgroundColor = '#444';
      style.color = '#00FF99';
    } else if (active) {
      style.backgroundColor =
          styles.subMenuItemActive?.backgroundColor ?? 'rgba(0,168,89,0.15)';
      style.color = styles.subMenuItemActive?.color ?? '#00A859';
    } else {
      style.backgroundColor = 'transparent';
      style.color = styles.subMenuItem.color;
    }

    return style;
  };


  const renderItem = (item: NavItem) => {
    const active = item.href ? pathname.startsWith(item.href) : false;
    const hasChildren = !!item.children?.length;

    return (
        <div key={item.id}>
          {item.href ? (
              <Link
                  href={item.href}
                  style={baseItemStyle(item.id, active)}
                  onMouseEnter={() => setHover(item.id)}
                  onMouseLeave={() => setHover(null)}
              >
                {item.icon}
                {item.label}
              </Link>
          ) : (
              <div
                  style={baseItemStyle(item.id, false)}
                  onClick={() => toggle(item.id)}
                  onMouseEnter={() => setHover(item.id)}
                  onMouseLeave={() => setHover(null)}
              >
                {item.icon}
                <span style={{ flex: 1 }}>{item.label}</span>
                {open[item.id] ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </div>
          )}

          {hasChildren && open[item.id] && (
              <div style={styles.subMenu}>
                {item.children!.map((child) => {
                  const childActive =
                      child.href ? pathname.startsWith(child.href) : false;
                  return (
                      <Link
                          key={child.id}
                          href={child.href!}
                          style={baseSubItemStyle(child.id, childActive)}
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

  return <aside style={styles.sidebar}>{nav.map(renderItem)}</aside>;
}



const styles: {
  sidebar: React.CSSProperties;
  menuItem: React.CSSProperties;
  subMenu: React.CSSProperties;
  subMenuItem: React.CSSProperties;
  subMenuItemActive: React.CSSProperties;
} = {
  sidebar: {
    width: '180px',
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
