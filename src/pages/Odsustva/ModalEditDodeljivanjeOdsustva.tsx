import React from "react";
import Modal from "../../components/Modal";

type Props = {
  show: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  data?: any;
};

const ModalEditDodeljivanjeOdsustva: React.FC<Props> = ({ show, onClose }) => {
  if (!show) return null;
  return (
    <Modal onCancel={onClose} onOK={() => onClose()} title="Izmena dodeljivanja odsustva" question="Sačuvati izmene?" />
  );
};

export default ModalEditDodeljivanjeOdsustva;
