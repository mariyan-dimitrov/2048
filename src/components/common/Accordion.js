import { useState, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { useStoreMe } from 'store-me';
import PropTypes from 'prop-types';
import cn from 'classnames';

import {
  dimensionsPropTypes,
  positionPropTypes,
  paddingPropTypes,
  marginPropTypes,
} from '../../interfaces/designSystemInterfaces';
import developmentChecks from '../../utils/developmentChecks';
import usePrevious from '../../hooks/usePrevious';
import IconButton from './IconButton';
import Separator from './Separator';
import Stack from './Stack';
import Card from './Card';
import Text from './Text';

const Accordion = ({
  entries,
  backgroundColor = 'surface_3',
  triggerIcon = 'fa-plus-circle',
  triggerIconSize = 18,
  triggerRotationDeg = 135,
  contentMaxHeight,
  isShowingRawData,
  width = 'auto',
  maxWidth,
  minWidth,
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
  padding = 0,
  paddingX,
  paddingY,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingBottom,
  dataTestId,
  ...rest
}) => {
  const [activeEntryIndex, setActiveEntryIndex] = useState(false);

  process.env.NODE_ENV === 'development' && developmentChecks(rest);

  return (
    <Card
      backgroundColor={backgroundColor}
      width={width}
      maxWidth={maxWidth}
      minWidth={minWidth}
      position={position}
      top={top}
      left={left}
      right={right}
      bottom={bottom}
      inset={inset}
      zIndex={zIndex}
      overflow={overflow}
      overflowX={overflowX}
      overflowY={overflowY}
      transform={transform}
      margin={margin}
      marginX={marginX}
      marginY={marginY}
      marginLeft={marginLeft}
      marginRight={marginRight}
      marginTop={marginTop}
      marginBottom={marginBottom}
      padding={padding}
      paddingX={paddingX}
      paddingY={paddingY}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
      paddingTop={paddingTop}
      paddingBottom={paddingBottom}
      dataTestId={cn(dataTestId, 'accordion')}
      id={id}
    >
      <Stack>
        {entries.map(({ title, description }, index) => (
          <Stack flex={1} key={index}>
            <AccordionEntry
              title={title}
              description={description}
              onSelect={() => setActiveEntryIndex(index === activeEntryIndex ? false : index)}
              isActive={activeEntryIndex === index}
              triggerIcon={triggerIcon}
              triggerIconSize={triggerIconSize}
              triggerRotationDeg={triggerRotationDeg}
              contentMaxHeight={contentMaxHeight}
              isShowingRawData={isShowingRawData}
            />

            {index !== entries.length - 1 && <Separator />}
          </Stack>
        ))}
      </Stack>
    </Card>
  );
};

export default Accordion;

Accordion.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.exact({
      title: PropTypes.string,
      description: PropTypes.string,
    })
  ),
  backgroundColor: PropTypes.string,
  triggerIcon: PropTypes.string,
  triggerIconSize: PropTypes.number,
  triggerRotationDeg: PropTypes.number,
  contentMaxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isShowingRawData: PropTypes.bool,
  width: dimensionsPropTypes.width,
  minWidth: dimensionsPropTypes.minWidth,
  maxWidth: dimensionsPropTypes.maxWidth,
  id: PropTypes.string,
  dataTestId: PropTypes.string,
  ...positionPropTypes,
  ...paddingPropTypes,
  ...marginPropTypes,
};

// TODO: Add PropTypes for AccordionEntry as well

const AccordionEntry = ({
  title,
  description,
  onSelect,
  isActive,
  triggerIcon,
  triggerIconSize,
  triggerRotationDeg,
  contentMaxHeight,
  isShowingRawData,
}) => {
  const { locale } = useStoreMe('locale');
  const [titleHeaderHeight, setTitleHeaderHeight] = useState(0);
  const [wholeTitleHeight, setWholeTitleHeight] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [, , isLocaleChanged] = usePrevious(locale);
  const prevIsActiveState = useRef(isActive);
  const animatedWrapRef = useRef();
  const isInTransition = useRef(false);
  const hasAllNeededMeasurements = Boolean(titleHeaderHeight && wholeTitleHeight);
  const heightPx = useMemo(() => {
    if (hasAllNeededMeasurements) {
      return isActive ? wholeTitleHeight : titleHeaderHeight;
    } else {
      return 'unset';
    }
  }, [hasAllNeededMeasurements, titleHeaderHeight, wholeTitleHeight, isActive]);

  useEffect(() => {
    if (isLocaleChanged) {
      setTitleHeaderHeight(0);
      setWholeTitleHeight(0);
    }
  }, [isLocaleChanged]);

  return (
    <AnimatedWrap
      ref={el => {
        animatedWrapRef.current = el;
        if (el && !wholeTitleHeight) {
          setWholeTitleHeight(el.clientHeight);
        }
      }}
      closedHeight={titleHeaderHeight}
      openedHeight={wholeTitleHeight}
      heightPx={heightPx}
      onTransitionEnd={({ target }) => {
        if (target === animatedWrapRef.current) {
          prevIsActiveState.current = isActive;
          isInTransition.current = false;
        }
      }}
    >
      <Stack>
        <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <Stack
            elRef={el => el && !titleHeaderHeight && setTitleHeaderHeight(el.clientHeight)}
            direction="row"
            padding={16}
            alignItems="center"
            justifyContent="space-between"
            spacing={24}
            onClick={() => {
              if (!isInTransition.current) {
                isInTransition.current = true;
                onSelect();
              }
            }}
          >
            <Text
              color={isHovered || isActive ? 'text_primary' : 'text_secondary'}
              heading={5}
              weight={500}
              text={title}
            />

            <AnimatedIconButton className={cn({ 'is-active': isActive })} triggerRotationDeg={triggerRotationDeg}>
              <IconButton
                hoverBgColorKey="surface_2"
                color={isHovered || isActive ? 'text_primary' : 'text_secondary'}
                icon={triggerIcon}
                iconSize={triggerIconSize}
              />
            </AnimatedIconButton>
          </Stack>
        </div>

        <Separator />

        <Stack padding={24} maxHeight={contentMaxHeight} overflowY="auto" overflowX="hidden">
          {isShowingRawData ? <TextWrap>{description}</TextWrap> : <Text body={2} text={description} />}
        </Stack>
      </Stack>
    </AnimatedWrap>
  );
};

const AnimatedWrap = styled.div`
  ${({ heightPx }) => heightPx && `height: ${heightPx}px`};
  overflow: hidden;
  transition: height 0.3s ease;

  p {
    margin: 0;
  }
`;

const AnimatedIconButton = styled.div`
  transform: rotate(0deg);
  transition: transform 0.3s ease;

  &.is-active {
    transform: rotate(${({ triggerRotationDeg }) => triggerRotationDeg}deg);
  }
`;

const TextWrap = styled.pre`
  max-width: 100%;
  white-space: pre-wrap;
  overflow-wrap: break-word;
`;
