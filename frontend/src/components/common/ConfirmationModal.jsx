import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export const ConfirmationModal = {
  confirm({ title, content, onOk, onCancel }) {
    Modal.confirm({
      title: title || '¿Está seguro?',
      icon: <ExclamationCircleOutlined className="text-warning" />,
      content: content || '¿Está seguro que desea realizar esta acción?',
      okText: 'Sí',
      cancelText: 'No',
      okButtonProps: {
        className: 'bg-red-500 hover:bg-red-600',
      },
      onOk,
      onCancel,
    });
  },
}; 