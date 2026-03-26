import { Modal } from "antd";
const UseModal = ({ children, title, isModaOpen, handleCancel, handleOk }) => {
  return (
    <Modal
      title={title}
      open={isModaOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose
    >
      {children}
    </Modal>
  );
};

export default UseModal;
