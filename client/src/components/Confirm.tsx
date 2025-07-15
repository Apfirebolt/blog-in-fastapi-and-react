import React from 'react';
import { Modal } from 'antd';

interface ConfirmProps {
    isOpen: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const Confirm: React.FC<ConfirmProps> = ({
    isOpen,
    title = 'Confirm',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
}) => {
    return (
        <Modal
            title={title}
            open={isOpen}
            onOk={onConfirm}
            onCancel={onCancel}
            okText={confirmText}
            cancelText={cancelText}
            okType="danger"
            centered
        >
            <p>{message}</p>
        </Modal>
    );
};

export default Confirm;
