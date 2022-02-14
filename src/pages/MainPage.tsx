import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { nanoid } from 'nanoid';
import { useTranslation } from 'react-i18next';
import * as S from 'components/Container.style';

interface CircleState {
  x: number;
  y: number;
  r: number;
  color: string;
}

interface ClickState {
  clickStartTime: number;
  isClicked: boolean;
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
  const [cx, setX] = useState(-100);
  const [cy, setY] = useState(-100);
  const [clickCircle, setClickCircle] = useState<ClickState>({
    clickStartTime: 0,
    isClicked: false,
    r: 0,
    color: '#FFFFFF',
  });
  const [timerId, setTimerId] = useState(-1);
  const [blendIndex, setBlendIndex] = useState(0);

  const genRandomColor = useCallback(() => {
    const randomNumber = Math.floor(Math.random() * 0xffffff);
    const randColor = randomNumber.toString(16).padStart(6, '0');
    return `#${randColor.toUpperCase()}`;
  }, []);

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

  const getRadius = (nowStarted?: boolean) => {
    const radiusBase = 10;
    if (nowStarted) {
      return radiusBase;
    }
    return radiusBase + (Date.now() - clickCircle.clickStartTime) / 5;
  };

  const whileMouseDownHandler = () => {
    const r = getRadius();
    setClickCircle({
      ...clickCircle,
      r,
    });
  };

  useEffect(() => {
    if (clickCircle.isClicked) {
      const id = window.setInterval(() => {
        whileMouseDownHandler();
      }, 10);
      setTimerId(id);
    } else {
      clearTimeout(timerId);
      setTimerId(-1);
    }
  }, [clickCircle.isClicked]);

  const mouseDownHandler: MouseEventHandler = (e) => {
    const r = getRadius(true);
    setClickCircle({
      isClicked: true,
      clickStartTime: Date.now(),
      r,
      color: genRandomColor(),
    });
    setX(e.clientX);
    setY(e.clientY);
  };

  const mouseMoveHandler: MouseEventHandler = (e) => {
    if (clickCircle.isClicked) {
      setX(e.clientX);
      setY(e.clientY);
    }
  };

  const mouseUpHandler: MouseEventHandler = (e) => {
    genCircle(e.clientX, e.clientY, getRadius(), clickCircle.color);
    setClickCircle({
      isClicked: false,
      clickStartTime: 0,
      r: 0,
      color: '#FFFFFF',
    });
    setX(-100);
    setY(-100);
  };

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
      {clickCircle.isClicked && (
        <S.Circle x={cx} y={cy} r={clickCircle.r} color={clickCircle.color} />
      )}
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
