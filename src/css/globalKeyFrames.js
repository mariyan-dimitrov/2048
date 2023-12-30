/* stylelint-disable declaration-block-single-line-max-declarations, length-zero-no-unit */
import { css } from 'styled-components';

export const globalKeyFrames = css`
  @keyframes fade-in {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes fade-out {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(359deg);
    }
  }

  @keyframes half-slide-from-top {
    0% {
      transform: translateY(0%);
    }

    100% {
      transform: translateY(10%);
    }
  }

  @keyframes half-slide-from-bottom {
    0% {
      transform: translateY(10%);
    }

    100% {
      transform: translateY(0%);
    }
  }

  @keyframes slide-from-right {
    0% {
      transform: translateX(110%);
    }

    100% {
      transform: translateX(0%);
    }
  }

  @keyframes slide-to-right {
    0% {
      transform: translateX(0%);
    }

    100% {
      transform: translateX(110%);
    }
  }

  @keyframes text-tooltip-border-move {
    0% {
      background-position: 0px bottom;
    }

    100% {
      background-position: 8px bottom;
    }
  }

  @keyframes checkbox-pop-in {
    0% {
      transform: scale(0);
    }

    75% {
      transform: scale(1.3);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes checkbox-pop-out {
    0% {
      transform: scale(1);
    }

    25% {
      transform: scale(1.3);
    }

    100% {
      transform: scale(0);
    }
  }

  @keyframes zoom-in-fade-in {
    0% {
      transform: scale(2);
      opacity: 0;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes zoom-in-pulse-fade-in {
    0% {
      transform: scale(2);
      opacity: 0;
    }

    70% {
      transform: scale(0.8);
      opacity: 1;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes zoom-out-fade-out {
    0% {
      opacity: 1;
      transform: scale(1);
    }

    100% {
      opacity: 0;
      transform: scale(6);
    }
  }

  @keyframes fade-in-slide-from-left {
    0% {
      opacity: 0;
      transform: translateX(-40%);
    }

    70% {
      opacity: 0.5;
      transform: translateX(5%);
    }

    100% {
      opacity: 1;
      transform: translateX(0%);
    }
  }

  @keyframes fade-in-slide-from-right {
    0% {
      opacity: 0;
      transform: translateX(40%);
    }

    70% {
      opacity: 0.5;
      transform: translateX(-5%);
    }

    100% {
      opacity: 1;
      transform: translateX(0%);
    }
  }

  @keyframes fade-in-slide-from-top {
    0% {
      opacity: 0;
      transform: translateY(-40%);
    }

    70% {
      opacity: 0.5;
      transform: translateY(5%);
    }

    100% {
      opacity: 1;
      transform: translateY(0%);
    }
  }

  @keyframes fade-in-slide-from-bottom {
    0% {
      opacity: 0;
      transform: translateY(40%);
    }

    70% {
      opacity: 0.5;
      transform: translateY(-5%);
    }

    100% {
      opacity: 1;
      transform: translateY(0%);
    }
  }

  @keyframes animate-left-to-right {
    0% {
      transform: translate(-100%, -50%);
    }

    100% {
      transform: translate(0, -50%);
    }
  }
  @keyframes rotate-clockwise-180-deg {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(180deg);
    }
  }

  @keyframes rotate-counterclockwise-180-deg {
    0% {
      transform: rotate(180deg);
    }

    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes ripple-centered {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    55% {
      transform: translate(-50%, -50%) scale(3.5);
    }
    100% {
      transform: translate(-50%, -50%) scale(3.5);
      opacity: 0;
    }
  }

  @keyframes show-drawer {
    0% {
      transform: translateY(100%);
    }
    60% {
      transform: translateY(-8%);
    }
    100% {
      transform: translateY(0%);
    }
  }

  @keyframes hide-drawer {
    0% {
      transform: translateY(0%);
    }
    100% {
      transform: translateY(100%);
    }
  }

  @keyframes drawer-backdrop-fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0.85;
    }
  }

  @keyframes drawer-backdrop-fade-out {
    0% {
      opacity: 0.85;
    }
    100% {
      opacity: 0;
    }
  }
`;

export const animationsNames = [...globalKeyFrames[0].matchAll(/@keyframes (.*?)\{/g)].map(
  animationName => animationName[1]
);

export default globalKeyFrames;
