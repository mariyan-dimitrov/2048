import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import cn from 'classnames';

import { allowedTooltipPlacement } from '../../interfaces/designSystemInterfaces';
import developmentChecks from '../../utils/developmentChecks';
import { hex_to_rgb } from '../../utils/js/convertColorType';
import getElementStyle from '../../utils/getElementStyle';
import { closeTutorial } from '../../actions/tutorials';
import useWindowSize from '../../hooks/useWindowSize';
import useColorMapping from './hooks/useColorMapping';
import useBreakpoints from './hooks/useBreakpoints';
import { isDevice } from '../../_constants/devices';
import styles from '../../themes/styles';
import Button from './Button';
import Text from './Text';

const tutorialShapeShowAnimationName = 'zoom-in-pulse-fade-in';
const tutorialShapeHideAnimationName = 'zoom-out-fade-out';

const Tutorial = ({
  id,
  size = 120,
  placement = 'right',
  title,
  description,
  takeElementShape = false,
  showCloseButton = true,
  onShow,
  onHide,
  ...rest
}) => {
  process.env.NODE_ENV === 'development' && developmentChecks(rest);

  const [tutorialStyles, setTutorialStyles] = useState(false);
  const [hideTutorial, setHideTutorial] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const overlayColor = useColorMapping(['surface_1', 'text_primary']);
  const { currentBreakpoint } = useBreakpoints();
  const { windowResized } = useWindowSize();
  const updatePopperRef = useRef();

  const { triggerClassName, getTooltipProps, setTriggerRef, setTooltipRef, triggerRef, state, ...popperProps } =
    usePopperTooltip(
      {
        placement,
      },
      {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, styles.spacing._16],
            },
          },
          {
            name: 'eventListeners',
            options: {
              resize: false,
            },
          },
        ],
      }
    );

  const markIntroPassed = useCallback(() => {
    const tutorialItem = document.getElementById(id);

    tutorialItem.removeEventListener('click', markIntroPassed, false);
    tutorialItem.classList.remove('auto-pointer-events');
    setHideTutorial(true);
  }, [id]);

  const buildTutorialShape = useCallback(() => {
    const tutorialItem = document.getElementById(id);

    if (tutorialItem) {
      const { left, top, height, width } = tutorialItem.getBoundingClientRect();

      if (takeElementShape) {
        setTutorialStyles({
          left,
          top,
          height,
          width,
          borderRadius: getElementStyle(tutorialItem, 'border-radius'),
        });
      } else {
        const tutorialRadius = Math.floor(size / 2);
        const itemHalfWidth = width / 2;
        const itemHalfHeight = height / 2;

        setTutorialStyles({
          left: Math.floor(left - tutorialRadius + itemHalfWidth),
          top: Math.floor(top - tutorialRadius + itemHalfHeight),
          height: size,
          width: size,
        });
      }
    }
  }, [takeElementShape, size, id]);

  useEffect(() => {
    onShow && onShow();
  }, [onShow]);

  useEffect(() => {
    updatePopperRef.current = popperProps.update;
  }, [popperProps]);

  useEffect(() => {
    tutorialStyles && updatePopperRef.current && updatePopperRef.current();
  }, [tutorialStyles]);

  useEffect(() => {
    triggerRef && buildTutorialShape();
  }, [triggerRef, windowResized, buildTutorialShape]);

  useEffect(() => {
    const tutorialItem = document.getElementById(id);

    if (tutorialItem) {
      tutorialItem.addEventListener('click', markIntroPassed, false);
      tutorialItem.classList.add('auto-pointer-events');
    }
  }, [id, markIntroPassed]);

  return ReactDOM.createPortal(
    <Wrap
      className={cn({
        'no-selection': isDevice,
        'no-scrollbars': isDevice,
      })}
      onAnimationEnd={({ animationName }) => {
        if (animationName === tutorialShapeHideAnimationName) {
          closeTutorial({ id, onHide });
          onHide && onHide(id);
        }
      }}
      data-testid={`tutorial-wrap-${id}`}
    >
      <TutorialShape
        className={cn(
          {
            hide: hideTutorial,
            show: tutorialStyles,
            'is-circle': !takeElementShape,
          },
          triggerClassName
        )}
        onAnimationEnd={({ animationName }) => animationName === tutorialShapeShowAnimationName && setShowContent(true)}
        shapeStyles={tutorialStyles || {}}
        overlayColor={overlayColor}
        ref={setTriggerRef}
      />

      {showContent && !hideTutorial && (
        <div {...getTooltipProps()} ref={setTooltipRef}>
          <Content className={cn(`position-${state?.placement}`, currentBreakpoint)}>
            <Text text={title} heading={3} weight={500} marginBottom={24} />
            <Text text={description} body={2} />

            {showCloseButton && (
              <Button
                text="CLOSE"
                size={2}
                onClick={() => setHideTutorial(true)}
                marginTop={24}
                dataTestId="close-tutorial"
              />
            )}
          </Content>
        </div>
      )}
    </Wrap>,
    document.body
  );
};

export default Tutorial;

Tutorial.propTypes = {
  id: PropTypes.string.isRequired,
  size: PropTypes.number,
  placement: PropTypes.oneOf(allowedTooltipPlacement),
  title: PropTypes.string,
  description: PropTypes.string,
  takeElementShape: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  onShow: PropTypes.func,
  onHide: PropTypes.func,
};

const Wrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  pointer-events: none;
  overflow: hidden;
`;

const TutorialShape = styled.div`
  position: absolute;
  top: ${({ shapeStyles }) => shapeStyles.top || 0}px;
  left: ${({ shapeStyles }) => shapeStyles.left || 0}px;
  width: ${({ shapeStyles }) => shapeStyles.width}px;
  height: ${({ shapeStyles }) => shapeStyles.height}px;
  border-radius: ${({ shapeStyles }) => shapeStyles.borderRadius};
  box-shadow: ${({ theme, overlayColor }) => `0 0 0 200vw ${hex_to_rgb({ hex: theme[overlayColor], opacity: 0.85 })}`};
  transform: scale(2);
  opacity: 0;

  &.is-circle {
    border-radius: 100%;
  }

  &.show {
    animation: ${tutorialShapeShowAnimationName} 0.7s ease-out forwards;
  }

  &.hide {
    animation: ${tutorialShapeHideAnimationName} 0.7s ease;
  }
`;

const Content = styled.div`
  max-width: 400px;
  opacity: 0;
  pointer-events: auto;
  padding: ${styles.spacing._32}px;
  border-radius: ${styles.borderRadius.radius_1}px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.surface_2};
  transition: background-color 0.3s ease, border-color 0.3s ease;

  &.mobile {
    max-width: 100%;
    padding: ${styles.spacing._16};
  }

  &.position-left,
  &.position-left-start,
  &.position-left-end {
    animation: fade-in-slide-from-left 0.4s ease-in forwards;
  }

  &.position-top,
  &.position-top-start,
  &.position-top-end {
    animation: fade-in-slide-from-top 0.4s ease-in forwards;
  }

  &.position-right,
  &.position-right-start,
  &.position-right-end {
    animation: fade-in-slide-from-right 0.4s ease-out forwards;
  }

  &.position-bottom,
  &.position-bottom-start,
  &.position-bottom-end {
    animation: fade-in-slide-from-bottom 0.5s ease-out forwards;
  }
`;
