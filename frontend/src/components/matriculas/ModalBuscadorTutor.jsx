'use client';

import { Modal } from 'antd';
import { BuscadorTutores } from './BuscadorTutores';

/**
 * Modal para buscar y asignar un tutor a una matrícula
 */
export function ModalBuscadorTutor({ visible, onClose, onSelect, alumnoNombre }) {
    return (
        <Modal
            title={`Asignar Tutor para: ${alumnoNombre}`}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={1000}
            centered
            destroyOnClose
        >
            <div className="py-2">
                <BuscadorTutores
                    onSelect={(tutor) => {
                        onSelect(tutor);
                        onClose();
                    }}
                    selectLabel="Asignar este Tutor"
                />
            </div>
        </Modal>
    );
}
