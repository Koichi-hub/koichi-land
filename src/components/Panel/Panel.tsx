import './Panel.css'
import appsIcon from '../../assets/icons/apps.svg'
import { forwardRef, useCallback, useMemo, useRef, useState, type Ref } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import { useClickAway } from 'react-use';
import { GridLayout, type Layout } from '@snapgridjs/react';
import { gravityCompactor } from '@snapgridjs/extras';

export default function Panel() {
    const [showModal, setShowModal] = useState(false);
    const showModalBtnRef = useRef<HTMLButtonElement>(null);

    return (
        <div className='panel'>
            <div className='panel-content'>
                <PanelButton ref={showModalBtnRef} label='' iconSrc={appsIcon} onClick={() => setShowModal(prevState => !prevState)} />
            </div>
            <AppsModal show={showModal} showModalBtnRef={showModalBtnRef} onClickOutside={() => setShowModal(false)} />
        </div>
    )
}

type AppsModalProps = {
    show: boolean;
    showModalBtnRef: React.RefObject<HTMLButtonElement | null>
    onClickOutside: () => void;
}
function AppsModal({show, showModalBtnRef, onClickOutside}: AppsModalProps) {
    const modalRef = useRef(null);

    useClickAway(modalRef, (event) => {
        if (showModalBtnRef && showModalBtnRef.current && showModalBtnRef.current.contains(event.target as Node)) {
            return; 
        }

        onClickOutside();
    });

    return (
        <AnimatePresence>
            {
            show &&
            <motion.div 
                ref={modalRef}
                className='apps-modal' 
                initial={{ x: '-20px', opacity: 0 }} // Начальное состояние (за экраном слева)
                animate={{ x: 0, opacity: 1 }}       // Состояние при появлении
                exit={{ x: '-20px', opacity: 0 }}    // Состояние при закрытии (уезжает обратно)
                transition={{ duration: 0.2 }} // Настройка плавности
            >
                <div className='apps-modal-content'>
                    <AppsBoard />
                </div>
            </motion.div>
            }
        </AnimatePresence>
    );
}

const AppsBoard = () => {
    const [layout, setLayout] = useState<Layout>([
        { i: "a", x: 0, y: 0, w: 1, h: 1 },
        { i: "b", x: 1, y: 0, w: 1, h: 1 },
        { i: "c", x: 2, y: 0, w: 1, h: 1 },
    ]);

    const gridWidth = 600;
    const columnsCount = 10;
    const gapSize = 6;
    const calculatedRowHeight = (gridWidth - gapSize * (columnsCount + 1)) / columnsCount;

    const gridConfig = useMemo(() => ({
        cols: columnsCount, 
        rowHeight: calculatedRowHeight, 
        margin: [gapSize, gapSize] as [number, number],
    }), []);

    const onLayoutChange = useCallback((nextLayout: Layout) => {
        // При переносе элемента на другую сетку ничего не меняем
        if (nextLayout.length < layout.length) return;
        
        setLayout(nextLayout);
    }, [setLayout]);
    
    return (
        <div className='apps-board'>
            <GridLayout
                layout={layout}
                width={gridWidth}
                onLayoutChange={onLayoutChange}
                gridConfig={gridConfig}
                compactor={gravityCompactor}
                resizeConfig={{ handles: ["se", "e", "s"] }}
            >
                {layout.map((item) => (
                    <div key={item.i} className="apps-board-tile">
                    </div>
                ))}
            </GridLayout>
        </div>
    )
}

type PanelButtonProps = {
    label: string;
    iconSrc?: string;
    onClick?: () => void;
}
const PanelButton = forwardRef(({label, iconSrc, onClick}: PanelButtonProps, ref: Ref<HTMLButtonElement>) => {
    return (
        <button ref={ref} className='panel-btn' onClick={onClick}>
            {iconSrc && <img src={iconSrc} width="20px" height="20px" alt="" />}
            {label}
        </button>
    )
})
