import * as React from "react";
import { IPlayer, IGameScoringParameters } from "./types";
import ArrayUtils from "./util/array";
import ObjectUtils from "./util/object";
import LabeledPlay from "./LabeledPlay";
import classNames from "classnames";
import { cardLookup } from "./util/cardHelpers";
import WasmContext from "./WasmContext";

interface IProps {
  players: IPlayer[];
  numDecks: number;
  points: { [playerId: number]: string[] };
  penalties: { [playerId: number]: number };
  landlordTeam: number[];
  landlord: number;
  hideLandlordPoints: boolean;
  smallerTeamSize: boolean;
  gameScoringParameters: IGameScoringParameters;
}

const Points = (props: IProps): JSX.Element => {
  const pointsPerPlayer = ObjectUtils.mapValues(props.points, (cards) =>
    ArrayUtils.sum(cards.map((card) => cardLookup[card].points))
  );
  const { computeScore } = React.useContext(WasmContext);
  const totalPointsPlayed = ArrayUtils.sum(Object.values(pointsPerPlayer));
  const nonLandlordPoints = ArrayUtils.sum(
    props.players
      .filter((p) => !props.landlordTeam.includes(p.id))
      .map((p) => pointsPerPlayer[p.id])
  );

  let nonLandlordPointsWithPenalties = nonLandlordPoints;
  props.players.forEach((p) => {
    const penalty = props.penalties[p.id];
    if (penalty > 0) {
      if (props.landlordTeam.includes(p.id)) {
        nonLandlordPointsWithPenalties += penalty;
      } else {
        nonLandlordPointsWithPenalties -= penalty;
      }
    }
  });
  const penaltyDelta = nonLandlordPointsWithPenalties - nonLandlordPoints;

  const { score, next_threshold: nextThreshold } = computeScore({
    params: props.gameScoringParameters,
    num_decks: props.numDecks,
    smaller_landlord_team_size: props.smallerTeamSize,
    non_landlord_points: nonLandlordPointsWithPenalties,
  });

  const playerPointElements = props.players.map((player) => {
    const onLandlordTeam = props.landlordTeam.includes(player.id);
    const cards =
      props.points[player.id].length > 0 ? props.points[player.id] : ["🂠"];
    const penalty =
      player.id in props.penalties ? props.penalties[player.id] : 0;

    if (props.hideLandlordPoints && onLandlordTeam) {
      return null;
    } else {
      return (
        <LabeledPlay
          key={player.id}
          className={classNames({ landlord: onLandlordTeam })}
          label={`${player.name}: ${pointsPerPlayer[player.id] - penalty}分`}
          cards={cards}
        />
      );
    }
  });

  // TODO: Pass the landlord as a Player object instead of numeric ID
  const landlord = props.players.find((p) => p.id === props.landlord);

  let thresholdStr = "";
  if (score.landlord_won) {
    thresholdStr = `${landlord.name}的团队将升${
      score.landlord_delta
    } level${score.landlord_delta === 1 ? "" : ""}`;
    if (score.landlord_bonus) {
      thresholdStr += "级, 包括小团队奖励。";
    }
  } else if (score.non_landlord_delta === 0) {
    thresholdStr = "庄家反家均不升级";
  } else {
    thresholdStr = `反方将升${
      score.non_landlord_delta
    } level${score.non_landlord_delta === 1 ? "" : ""}`;
  }

  thresholdStr += `级 (下一个坎: ${nextThreshold}分)`;

  return (
    <div className="points">
      <h2>得分</h2>
      <p>
        {penaltyDelta === 0
          ? nonLandlordPoints
          : `${nonLandlordPoints} + ${penaltyDelta}`}
        分{props.hideLandlordPoints ? null : ` / ${totalPointsPlayed}分`}：反家从{landlord.name}的团队抢的分. {thresholdStr}
      </p>
      {playerPointElements}
    </div>
  );
};

export default Points;
