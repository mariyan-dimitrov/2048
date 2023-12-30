import { useState, useEffect, useRef, useMemo } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';
import { useStoreMe } from 'store-me';
import PropTypes from 'prop-types';
import cn from 'classnames';

import {
  allowedTooltipPlacement,
  positionPropTypes,
  paddingPropTypes,
  marginPropTypes,
} from '../../interfaces/designSystemInterfaces';
import developmentChecks from '../../utils/developmentChecks';
import generateStyles from '../../utils/generateStyles';
import { isDevice } from '../../_constants/devices';
import Tooltip from './Tooltip';
import Icon from './Icon';
import Text from './Text';

const CopyToClipBoard = ({
  tooltipCopiedTitle,
  tooltipPlacement,
  isDisabledTooltip,
  tooltipTitle,
  children,
  tooltipOffset,
  isTooltipIncludingFullAddress,
  text,
  cursor,
  dataTestId,
  id,
  position,
  top,
  left,
  right,
  bottom,
  inset,
  zIndex,
  overflow,
  overflowX,
  overflowY,
  transform,
  margin,
  marginX,
  marginY,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  padding,
  paddingX,
  paddingY,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingBottom,
  isFluid,
  ...rest
}) => {
  const { i18n } = useStoreMe('i18n');
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const hideTooltipTimeoutRef = useRef();
  const changeCopiedTimeoutRef = useRef();
  const copyHeadline = i18n(tooltipTitle || 'COMMON.COPY_TO_CLIPBOARD');
  const copySuccessHeadline = i18n(tooltipCopiedTitle || 'COMMON.COPIED');
  const tooltipValue = useMemo(() => {
    if (copied) {
      return (
        <>
          {copySuccessHeadline}
          <Icon icon="fa-check-circle" iconType="solid" marginLeft={8} size={14} />
        </>
      );
    } else if (isTooltipIncludingFullAddress && !isDevice) {
      return (
        <>
          <Text text="COPY_ADDRESS_TO_CLIPBOARD" weight={500} />
          <Text text={text} />
        </>
      );
    } else {
      return !isDevice && copyHeadline;
    }
  }, [copied, copyHeadline, copySuccessHeadline, isTooltipIncludingFullAddress, text]);

  process.env.NODE_ENV === 'development' && developmentChecks(rest);

  function onCopy() {
    setShow(true);
    setCopied(true);
    clearTimeout(hideTooltipTimeoutRef.current);
    hideTooltipTimeoutRef.current = setTimeout(() => setShow(false), 3000);
  }

  useEffect(() => {
    return () => {
      clearTimeout(hideTooltipTimeoutRef.current);
      clearTimeout(changeCopiedTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!show && copied) {
      changeCopiedTimeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 500);

      return () => {
        clearTimeout(changeCopiedTimeoutRef.current);
      };
    }
  }, [copied, show]);

  return (
    <Wrap
      id={id}
      data-testid={cn('copy-to-clipboard', dataTestId)}
      generatedStyles={generateStyles({
        position,
        top,
        left,
        right,
        bottom,
        inset,
        zIndex,
        overflow,
        overflowX,
        overflowY,
        transform,
        margin,
        marginX,
        marginY,
        marginLeft,
        marginRight,
        marginTop,
        marginBottom,
        padding,
        paddingX,
        paddingY,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
      })}
      isFluid={isFluid}
    >
      <Tooltip
        isTooltipShown={show}
        cursor={cursor}
        forceVariant={copied || !tooltipTitle ? 1 : undefined}
        tooltip={tooltipValue}
        placement={tooltipPlacement || 'right'}
        color={copied ? 'accent_3' : 'text_primary'}
        offset={tooltipOffset}
        isAutoWidth={isTooltipIncludingFullAddress}
        isFluid={isFluid}
      >
        <CopyToClipboard text={text} onCopy={onCopy}>
          <Content
            onMouseEnter={() => {
              if (!isDisabledTooltip) {
                clearTimeout(changeCopiedTimeoutRef.current);
                setCopied(false);
                copyHeadline && !copied && setShow(true);
              }
            }}
            onMouseLeave={() => {
              clearTimeout(hideTooltipTimeoutRef.current);

              if (copied) {
                hideTooltipTimeoutRef.current = setTimeout(() => setShow(false), 300);
              } else {
                setShow(false);
              }
            }}
          >
            {children}
          </Content>
        </CopyToClipboard>
      </Tooltip>
    </Wrap>
  );
};

export default CopyToClipBoard;

CopyToClipBoard.propTypes = {
  tooltipCopiedTitle: PropTypes.string,
  tooltipPlacement: PropTypes.oneOf(allowedTooltipPlacement),
  isDisabledTooltip: PropTypes.bool,
  tooltipTitle: PropTypes.string,
  children: PropTypes.node,
  gutter: PropTypes.string,
  cursor: PropTypes.string,
  tooltipOffset: PropTypes.array,
  isTooltipIncludingFullAddress: PropTypes.bool,
  text: PropTypes.string.isRequired,
  dataTestId: PropTypes.string,
  id: PropTypes.string,
  isFluid: PropTypes.bool,
  ...positionPropTypes,
  ...paddingPropTypes,
  ...marginPropTypes,
};

const Wrap = styled.div`
  display: flex;
  cursor: pointer;
  width: ${({ isFluid }) => (isFluid ? '100%' : null)};
  ${({ generatedStyles }) => generatedStyles};
`;

const Content = styled.span`
  position: relative;
`;
