import {
  useState,
  useEffect,
  MouseEventHandler,
  TouchEventHandler,
} from 'react';

interface ClickState {
  clickStartTime: number;
  isClicked: boolean;
  r: number;
  color: string;
}

interface useDragAndDropDrawParameter {
  beforeMouseUp?: MouseEventHandler;
  beforeTouchUp?: TouchEventHandler;
  beforeMouseDown?: MouseEventHandler;
  beforeTouchDown?: TouchEventHandler;
}

const useDragAndDropDraw = (params: useDragAndDropDrawParameter) => {
  const { beforeMouseUp, beforeTouchUp, beforeMouseDown, beforeTouchDown } =
    params;
  const [cx, setX] = useState(-100);
  const [cy, setY] = useState(-100);
  const [clickCircle, setClickCircle] = useState<ClickState>({
    clickStartTime: 0,
    isClicked: false,
    r: 0,
    color: '#FFFFFF',
  });
  const [timerId, setTimerId] = useState(-1);

  const genRandomColor = () => {
    const randomNumber = Math.floor(Math.random() * 0xffffff);
    const randColor = randomNumber.toString(16).padStart(6, '0');
    return `#${randColor.toUpperCase()}`;
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
    if (beforeMouseDown !== undefined) beforeMouseDown(e);

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

  const touchDownHandler: TouchEventHandler = (e) => {
    if (beforeTouchDown !== undefined) beforeTouchDown(e);

    const r = getRadius(true);
    setClickCircle({
      isClicked: true,
      clickStartTime: Date.now(),
      r,
      color: genRandomColor(),
    });
    setX(e.touches[0].clientX);
    setY(e.touches[0].clientX);
  };

  const mouseMoveHandler: MouseEventHandler = (e) => {
    if (clickCircle.isClicked) {
      setX(e.clientX);
      setY(e.clientY);
    }
  };

  const touchMoveHandler: TouchEventHandler = (e) => {
    if (clickCircle.isClicked) {
      setX(e.touches[0].clientX);
      setY(e.touches[0].clientY);
    }
  };

  const mouseUpHandler: MouseEventHandler = (e) => {
    if (beforeMouseUp !== undefined) beforeMouseUp(e);

    setClickCircle({
      isClicked: false,
      clickStartTime: 0,
      r: 0,
      color: '#FFFFFF',
    });
    setX(-100);
    setY(-100);
  };

  const touchUpHandler: TouchEventHandler = (e) => {
    if (beforeTouchUp !== undefined) beforeTouchUp(e);

    setClickCircle({
      isClicked: false,
      clickStartTime: 0,
      r: 0,
      color: '#FFFFFF',
    });
    setX(-100);
    setY(-100);
  };

  return {
    nowSelectedCircle: { x: cx, y: cy, metadata: { ...clickCircle } },
    mouseDownHandler,
    touchDownHandler,
    mouseMoveHandler,
    touchMoveHandler,
    mouseUpHandler,
    touchUpHandler,
  };
};

export default useDragAndDropDraw;
