import React, { useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
import { useTranslation } from 'react-i18next';
import * as S from 'components/Container.style';
import useDragAndDropDraw from 'hooks/useDragAndDrop';

interface CircleState {
  x: number;
  y: number;
  r: number;
  color: string;
}

const blendMode = [
  'normal',
  'multiply',
  'darken',
  'screen',
  'lighten',
  'overlay',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
  'hue',
  'saturation',
  'color',
  'luminosity',
];

const MainPage: React.FC = () => {
  const [circleStates, setCircleStates] = useState<CircleState[]>([]);
  const [blendIndex, setBlendIndex] = useState(0);

  const genCircle = (x: number, y: number, r: number, color: string) => {
    setCircleStates([
      ...circleStates,
      {
        x,
        y,
        r,
        color,
      },
    ]);
  };

  const {
    nowSelectedCircle: {
      x,
      y,
      metadata: { r, color, isClicked },
    },
    mouseDownHandler,
    mouseMoveHandler,
    mouseUpHandler,
  } = useDragAndDropDraw((e) => {
    genCircle(e.clientX, e.clientY, r, color);
  });

  const circles = useMemo(
    () =>
      circleStates.map((element) => <S.Circle {...element} key={nanoid()} />),
    [circleStates]
  );

  const { t } = useTranslation();

  return (
    <S.Container
      blendMode={blendMode[blendIndex]}
      onMouseMove={mouseMoveHandler}
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
    >
      <S.Header>{t('header')}</S.Header>
      {circles}
      {isClicked && <S.Circle x={x} y={y} r={r} color={color} />}
      <S.Button
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
          setBlendIndex((blendIndex + 1) % blendMode.length);
        }}
      >
        {blendMode[blendIndex]}
      </S.Button>
    </S.Container>
  );
};

export default MainPage;
