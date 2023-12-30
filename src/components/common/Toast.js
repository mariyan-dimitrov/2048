/* stylelint-disable selector-class-pattern */
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useStoreMe } from 'store-me';

import developmentChecks from '../../utils/developmentChecks';
import useBreakpoints from './hooks/useBreakpoints';
import styles from '../../themes/styles';

const Toast = rest => {
  process.env.NODE_ENV === 'development' && developmentChecks(rest);

  const { additionalToastOffset } = useStoreMe('additionalToastOffset');
  const { inDesktop } = useBreakpoints();

  return createPortal(
    <StyledToastContainer
      enableMultiContainer
      containerId="desktop"
      icon={false}
      draggable={!inDesktop}
      closeOnClick={false}
      hideProgressBar
      additionalToastOffset={additionalToastOffset}
    />,
    document.body
  );
};

export default Toast;

Toast.propTypes = {};

const StyledToastContainer = styled(ToastContainer)`
  &.Toastify__toast-container {
    padding: 0;
  }

  &.Toastify__toast-container--top-right {
    z-index: 10001;
    max-height: calc(100% - 70px);
    top: ${({ additionalToastOffset }) => additionalToastOffset + 70}px;
    right: ${styles.spacing._24}px;
    padding-left: 10px;
    width: 348px;
    overflow-y: auto;
    overflow-x: hidden;

    @media ${styles.grid.breakpoints.mobile} {
      width: 100%;
      padding-right: 10px;
    }
  }

  &.Toastify__toast-container--bottom-right {
    z-index: 1000;
    width: 343px;
    bottom: ${styles.spacing._24}px;
    right: ${styles.spacing._24}px;
  }

  .Toastify__toast {
    font-family: 'TTNorms', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    border-radius: ${styles.borderRadius.radius_1}px;
    transition: background-color 0.3s ease;
    min-height: auto;
    cursor: default;

    .Toastify__toast-body {
      margin: 0;
      padding: 0;
    }

    &.general-toast {
      padding: ${styles.spacing._16}px;
      margin-bottom: ${styles.spacing._24}px;
      background-color: ${({ theme }) => theme.surface_3};
      box-shadow: ${({ theme }) => theme.shadow_general};

      @media ${styles.grid.breakpoints.mobile} {
        margin-bottom: ${styles.spacing._16};
      }

      .toast-type-icon {
        padding-top: 1px;
      }

      &.Toastify__toast--success {
        border-left: 3px solid ${({ theme }) => theme.semantic_success};

        .toast-type-icon {
          color: ${({ theme }) => theme.semantic_success};
        }
      }

      &.Toastify__toast--info {
        border-left: 3px solid ${({ theme }) => theme.accent_1};

        .toast-type-icon {
          color: ${({ theme }) => theme.accent_1};
        }
      }

      &.Toastify__toast--warning {
        border-left: 3px solid ${({ theme }) => theme.semantic_attention};

        .toast-type-icon {
          color: ${({ theme }) => theme.semantic_attention};
        }
      }

      &.Toastify__toast--error {
        border-left: 3px solid ${({ theme }) => theme.semantic_error};

        .toast-type-icon {
          color: ${({ theme }) => theme.semantic_error};
        }
      }

      .toast-inner-wrap {
        display: flex;
      }

      .toast-content-wrap {
        padding-left: ${styles.spacing._12}px;
      }

      .toast-close-button {
        position: absolute;
        top: 0;
        right: 0;
        padding-top: 3px;
      }
    }

    &.transaction-toast {
      align-items: center;
      margin: 0;
      margin-top: ${styles.spacing._8}px;
      padding: ${styles.spacing._12}px ${styles.spacing._16}px;
      background-color: ${({ theme }) => theme.accent_1};
      box-shadow: ${({ theme }) => theme.shadow_accent};

      &.is-clickable {
        cursor: pointer;
      }

      &.has-stuck-transaction {
        background-color: ${({ theme }) => theme.semantic_attention};
        box-shadow: ${({ theme }) => theme.shadow_attention};
      }

      .Toastify__toast-body {
        min-height: 23px;
      }

      .toast-content-wrap {
        display: flex;
        align-items: center;
      }

      .toast-inner-wrap {
        display: flex;
        padding-right: ${styles.spacing._24}px;
      }

      .toast-close-button {
        position: absolute;
        display: flex;
        align-items: center;
        top: 0;
        right: 0;
        bottom: 0;
      }
    }
  }
`;
