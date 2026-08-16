import { useRef } from 'react';
import ReactDom from 'react-dom';
import { useClickAway } from 'react-use';
import './ContextMenu.css'

type ContextMenuProps = {
    x: number;
    y: number;
    tileId: string;
    onClose: () => void;
    onDelete?: (id: string) => void;
};
export default function ContextMenu({ x, y, tileId, onClose, onDelete }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useClickAway(menuRef, () => {
        onClose();
    });

    return ReactDom.createPortal(
        <div
            ref={menuRef}
            className="context-menu"
            style={{
                top: `${y}px`,
                left: `${x}px`,
            }}
        >
            <div className='context-menu-items'>
                <div className='context-menu-item' onClick={() => { console.log('Редактируем', tileId); onClose(); }}>
                    ⚙️ Настроить виджет
                </div>
                <div className='context-menu-item' onClick={() => onDelete && onDelete(tileId)}>
                    🗑️ Удалить тайл
                </div>
            </div>
        </div>,
        document.body
    );
};
