import { usePopperTooltip } from 'react-popper-tooltip';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useStoreMe } from 'store-me';
import PropTypes from 'prop-types';
import cn from 'classnames';

import {
  allowedBackgroundColorValues,
  allowedTooltipPlacement,
  allowedTextColorValues,
} from '../../interfaces/designSystemInterfaces';
import developmentChecks from '../../utils/developmentChecks';
import { hex_to_rgb } from '../../utils/js/convertColorType';
import { isDevice } from '../../_constants/devices';
import useBreakpoints from './hooks/useBreakpoints';
import styles from '../../themes/styles';

function getBackgroundColor({ bgColorName, bgOpacity, theme }) {
  let bgColor = theme[bgColorName];

  if (bgColor.includes('#') && bgOpacity) {
    bgColor = hex_to_rgb({ hex: bgColor, opacity: bgOpacity || 1 });
  }

  return bgColor;
}

// TODO: tooltip property to also support array with [transactionKey, translationParts]
// TODO: Add a fade-out tooltip animation, when tooltip closes.
const Tooltip = ({
  isMask,
  offset = [0, 8],
  trigger,
  tooltip,
  backgroundColor = 'surface_3',
  color = 'text_primary',
  placement = 'top',
  cursor,
  hasDashedBottomBorder,
  forceVariant,
  onClick,
  children,
  isAutoWidth,
  bgOpacity,
  delayHide,
  delayShow,
  className,
  hideAfter,
  dataTestId,
  isInteractive,
  isGoingToCloseOnTriggerHidden,
  closeButton,
  isTooltipShown,
  isFollowingCursor,
  triggerClassName,
  isPointerEventsEnabled,
  isInCurrentDomElement,
  isClosedOnTriggerHidden,
  isFluid,
  ...rest
}) => {
  process.env.NODE_ENV === 'development' && developmentChecks(rest);

  const [forceTooltipShown, setForceTooltipShown] = useState(isTooltipShown);
  const { currentBreakpoint } = useBreakpoints();
  const { i18n } = useStoreMe('i18n');
  const standardVariant = (typeof tooltip === 'string' && (i18n(tooltip).length < 35 ? 1 : 2)) || 2;
  const isTooltipString = typeof tooltip === 'string';
  const isTooltipArray = Array.isArray(tooltip);
  const variant = forceVariant || standardVariant;
  const gutterPerVariant = {
    1: 8,
    2: 16,
  };
  const fontWeightPerVariant = {
    1: 500,
    2: 400,
  };

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip(
    {
      trigger: trigger || isDevice ? 'click' : 'hover',
      visible: forceTooltipShown,
      followCursor: isFollowingCursor,
      interactive: isInteractive,
      closeOnTriggerHidden: isGoingToCloseOnTriggerHidden,
      delayHide,
      delayShow,
      placement,
      isClosedOnTriggerHidden,
      offset,
    },
    {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: offset,
          },
        },
      ],
    }
  );

  const tooltipWrap = (
    <TooltipWrap
      {...getTooltipProps({
        className: cn(
          'tooltip-container',
          {
            'enable-pointer-events': isPointerEventsEnabled,
            'current-dom-el': isInCurrentDomElement,
            'is-auto-width': isAutoWidth,
          },
          `variant-${variant}`,
          className
        ),
      })}
      onClick={onClick}
      bgOpacity={bgOpacity}
      colorName={color}
      bgColorName={backgroundColor}
      gutter={gutterPerVariant[variant]}
      fontWeight={fontWeightPerVariant[variant]}
      currentBreakpoint={currentBreakpoint}
      data-testid={dataTestId}
      ref={setTooltipRef}
    >
      <TooltipContent className="tooltip-content">
        {closeButton}
        {(isTooltipArray && i18n(tooltip[0], tooltip[1])) || (isTooltipString && i18n(tooltip)) || tooltip}
      </TooltipContent>
    </TooltipWrap>
  );

  useEffect(() => {
    setForceTooltipShown(isTooltipShown);

    if (isTooltipShown && hideAfter) {
      const timeout = setTimeout(() => setForceTooltipShown(false), hideAfter);

      return () => clearTimeout(timeout);
    }
  }, [isTooltipShown, hideAfter]);

  return (
    <>
      <Trigger
        className={cn('tooltip-trigger', triggerClassName, {
          'is-with-border': hasDashedBottomBorder,
          'is-tooltip-active': visible,
          'is-mask': isMask,
        })}
        isFluid={isFluid}
        ref={setTriggerRef}
        cursor={cursor}
      >
        {children}
      </Trigger>

      {visible && isInCurrentDomElement && tooltipWrap}
      {visible && !isInCurrentDomElement && createPortal(tooltipWrap, document.body)}
    </>
  );
};

export default Tooltip;

Tooltip.propTypes = {
  isMask: PropTypes.bool,
  forceVariant: PropTypes.oneOf([1, 2]),
  offset: PropTypes.arrayOf(PropTypes.number),
  trigger: PropTypes.oneOf([null, 'right-click', 'click', 'hover', 'focus']),
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.node]),
  color: PropTypes.oneOf(allowedTextColorValues),
  backgroundColor: PropTypes.oneOf(allowedBackgroundColorValues),
  onClick: PropTypes.func,
  children: PropTypes.node,
  cursor: PropTypes.string,
  isAutoWidth: PropTypes.bool,
  bgOpacity: PropTypes.number,
  placement: PropTypes.oneOf(allowedTooltipPlacement),
  delayHide: PropTypes.number,
  delayShow: PropTypes.number,
  className: PropTypes.string,
  hideAfter: PropTypes.number,
  dataTestId: PropTypes.string,
  isInteractive: PropTypes.bool,
  closeButton: PropTypes.element,
  isTooltipShown: PropTypes.bool,
  isFollowingCursor: PropTypes.bool,
  isGoingToCloseOnTriggerHidden: PropTypes.bool,
  triggerClassName: PropTypes.string,
  isFluid: PropTypes.bool,
  hasDashedBottomBorder: PropTypes.bool,
  isPointerEventsEnabled: PropTypes.bool,
  isInCurrentDomElement: PropTypes.bool,
  isClosedOnTriggerHidden: PropTypes.bool,
};

const TooltipWrap = styled.div`
  &.tooltip-container {
    display: flex;
    flex-direction: column;
    z-index: 1000000;
    color: ${({ theme, colorName }) => theme[colorName]};
    cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
    max-width: 280px;
    max-height: 90%;
    padding: ${({ gutter }) => gutter}px;
    font-weight: ${({ fontWeight }) => fontWeight};
    line-height: ${styles.typography.headings[5].line_height};
    border-radius: ${styles.borderRadius.radius_1}px;
    background-color: ${getBackgroundColor};
    box-shadow: ${({ theme }) => theme.shadow_general};
    animation: fade-in 0.3s ease;
    pointer-events: none;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;

    &.enable-pointer-events {
      pointer-events: auto;
    }

    &.mobile {
      max-width: calc(100% - 20px);
    }
  }

  &.variant-1 {
    line-height: 1;
  }

  &.is-auto-width {
    max-width: unset;
  }

  &.current-dom-el {
    box-sizing: initial;
    white-space: nowrap;

    .tooltip-content {
      line-height: 1;
    }

    &.mobile {
      max-width: unset;
    }
  }
`;

const TooltipContent = styled.div`
  &:before {
    margin-bottom: 0.0545em;
  }

  &:after {
    margin-top: -0.0545em;
  }
`;

const Trigger = styled.span`
  width: ${({ isFluid }) => (isFluid ? '100%' : null)};
  cursor: ${({ cursor, onClick }) => cursor || (onClick ? 'pointer' : 'default')};

  &.is-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  &.is-with-border {
    background-size: 8px 1px;
    background-image: linear-gradient(to right, ${({ theme }) => theme.accent_1} 65%, transparent 0%);
    background-repeat: repeat-x;
    background-position: left bottom;
    cursor: help;

    &.is-tooltip-active > * {
      color: ${({ theme }) => theme.accent_1};
    }

    &:hover {
      animation: text-tooltip-border-move 0.7s linear infinite;
    }
  }
`;
