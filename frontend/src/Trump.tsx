import * as React from "react";
import { ITrump } from "./types";
import InlineCard from "./InlineCard";
import preloadedCards from "./preloadedCards";

interface IProps {
  trump: ITrump;
}
const Trump = (props: IProps): JSX.Element => {
  const { trump } = props;
  if (trump.Standard !== undefined) {
    const { suit, number: rank } = trump.Standard;
    const card = preloadedCards.filter(
      (v) => v.typ === suit && v.number === rank
    )[0].value;
    return (
      <div className="trump">
        此轮主牌是<InlineCard card={card} /> (打{rank})
      </div>
    );
  } else {
    return <div className="trump">无将, 打{trump.NoTrump.number}</div>;
  }
};

export default Trump;
