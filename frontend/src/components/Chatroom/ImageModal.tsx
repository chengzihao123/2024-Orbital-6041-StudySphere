import React from &aposreact&apos;
import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";
import Zoom from &aposreact-medium-image-zoom&apos;
import &aposreact-medium-image-zoom/dist/styles.css&apos;

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Zoom>
            <img src={imageUrl} alt="Enlarged view" style={{ width: &apos100%&apos, maxHeight: &apos80vh&apos }} />
          </Zoom>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImageModal;
