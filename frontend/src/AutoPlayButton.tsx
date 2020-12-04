import * as React from "react";

interface IProps {
  onSubmit: () => void;
  playDescription: null | string;
  canSubmit: boolean;
  currentWinner: number | null;
  isCurrentPlayerTurn: boolean;
  unsetAutoPlayWhenWinnerChanges: boolean;
}

type AutoPlay = {
  observedWinner: number | null;
} | null;

const AutoPlayButton = (props: IProps): JSX.Element => {
  const {
    onSubmit,
    canSubmit,
    isCurrentPlayerTurn,
    playDescription,
    currentWinner,
    unsetAutoPlayWhenWinnerChanges,
  } = props;

  const [autoplay, setAutoplay] = React.useState<AutoPlay | null>(null);

  React.useEffect(() => {
    if (autoplay !== null) {
      if (!canSubmit) {
        setAutoplay(null);
      } else if (
        unsetAutoPlayWhenWinnerChanges &&
        autoplay.observedWinner !== currentWinner
      ) {
        setAutoplay(null);
      } else if (isCurrentPlayerTurn) {
        setAutoplay(null);
        onSubmit();
      }
    }
  }, [
    autoplay,
    canSubmit,
    currentWinner,
    isCurrentPlayerTurn,
    unsetAutoPlayWhenWinnerChanges,
  ]);

  const handleClick = (): void => {
    if (isCurrentPlayerTurn) {
      onSubmit();
    } else if (autoplay !== null) {
      setAutoplay(null);
    } else {
      setAutoplay({ observedWinner: currentWinner });
    }
  };
  return (
    <button onClick={handleClick} disabled={!canSubmit}>
      {isCurrentPlayerTurn
        ? `出选中的牌${
            playDescription !== null ? " (" + playDescription + ")" : ""
          }`
        : autoplay !== null
        ? "停止自动出选中的牌"
        : "自动出选中的牌"}
    </button>
  );
};

export default AutoPlayButton;
