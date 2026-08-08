import './Panel.css'
import appsIcon from '../../assets/icons/apps.svg'
import { forwardRef, useRef, useState, type Ref } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import { useClickAway } from 'react-use';

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

                </div>
            </motion.div>
            }
        </AnimatePresence>
    );
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
