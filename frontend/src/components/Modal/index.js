import React from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';
import { CustomModal, Container, Header, Title, Content } from './styles';

export default function Modal({ children, title, isShow, onClose, width }) {
  return (
    <CustomModal isShow={isShow}>
      <Container width={width}>
        <Header>
          <Title>{title}</Title>
          <MdClose size={24} color="#666" onClick={onClose} />
        </Header>
        <Content>{children}</Content>
      </Container>
    </CustomModal>
  );
}

Modal.defaultProps = {
  title: '',
  width: '700px',
  isShow: false,
};

Modal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  title: PropTypes.string,
  isShow: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  width: PropTypes.string,
};
