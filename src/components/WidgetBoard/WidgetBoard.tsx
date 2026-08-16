import { GridLayout, noCompactor, useContainerWidth, type Layout, type LayoutItem } from '@snapgridjs/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './WidgetBoard.css';
import useWidgetPositions from '../../hooks/useWidgetPositions';
import ContextMenu from '../ContextMenu/ContextMenu';

type MenuState = {
    x: number;
    y: number;
    tileId: string;
} | null;
export default function WidgetBoard() {
    const { width, containerRef: snapgridContainerRef } = useContainerWidth();
    const [layout, setLayout] = useWidgetPositions("widgetBoardLayout", [
        { i: "a1", x: 0, y: 0, w: 4, h: 2 },
        { i: "b1", x: 4, y: 0, w: 4, h: 2 },
        { i: "c1", x: 8, y: 0, w: 4, h: 2 },
    ]);
    
    const [menu, setMenu] = useState<MenuState>(null);

    const [containerHeight, setContainerHeight] = useState(0);
    const localRef = useRef<HTMLDivElement | null>(null);

    const ROW_HEIGHT = 60;
    const MARGIN_Y = 15;

    const combinedRef = (element: HTMLDivElement | null) => {
        localRef.current = element;
        snapgridContainerRef(element);
    };

    useEffect(() => {
        const container = localRef.current;
        if (!container) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerHeight(entry.contentRect.height);
            }
        });

        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, []);

    const maxRows = useMemo(() => {
        if (!containerHeight) return 10; // Дефолтное значение до первого замера

        // Формула: (Высота + отступ) / (Высота_ряда + отступ)
        return Math.floor((containerHeight + MARGIN_Y) / (ROW_HEIGHT + MARGIN_Y));
    }, [containerHeight]);

    const gridConfig = useMemo(() => ({
        cols: 12,
        rowHeight: ROW_HEIGHT,
        margin: [15, MARGIN_Y] as [number, number],
        maxRows: maxRows,
    }), [maxRows]);

    const onLayoutChange = useCallback((nextLayout: Layout) => {
        if (nextLayout.length > layout.length) {
            const newItem = nextLayout.find((x: LayoutItem) => !layout.some((y: LayoutItem) => y.i === x.i));
            setLayout(nextLayout.map(item => {
                if (item.i === newItem!.i)
                    return { ...item, i: `${item.i}-clone-${Date.now()}` }
                return item;
            }));
            return;
        }

        setLayout(nextLayout);
    }, [layout, setLayout])

    return (
        <div ref={combinedRef} className='widget-container'>
            <GridLayout
                layout={layout}
                width={width}
                onLayoutChange={onLayoutChange}
                gridConfig={gridConfig}
                resizeConfig={{ handles: ["se", "e", "s"] }}
                compactor={{
                    ...noCompactor,
                    allowOverlap: false,    // Переопределяем: накладывать элементы нельзя
                    preventCollision: true  // Переопределяем: толкать элементы нельзя
                }}
            >
                {layout.map((item) => <WidgetTile i={item.i} key={item.i} onOpenMenu={(x, y) => setMenu({ x, y, tileId: item.i })} />)}
            </GridLayout>

            {/* Рендерим меню, если оно активно */}
            {menu && (
                <ContextMenu
                    x={menu.x}
                    y={menu.y}
                    tileId={menu.tileId}
                    onClose={() => setMenu(null)}
                />
            )}
        </div>
    );
}

type WidgetTileProps = {
    i: string;
    onOpenMenu: (x: number, y: number) => void;
}
const WidgetTile = ({ i, onOpenMenu }: WidgetTileProps) => {
    const handleContextMenu = (e: any) => {
        e.preventDefault();
        e.stopPropagation(); // Железно глушим всплытие, чтобы @snapgridjs не дергался

        onOpenMenu(e.clientX, e.clientY);
    };

    return (
        <div className="tile" onContextMenu={handleContextMenu}>
            {i}
        </div>
    )
}
