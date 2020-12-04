import * as React from "react";
import ReactTooltip from "react-tooltip";
import * as ReactModal from "react-modal";
import { IEmojiData } from "emoji-picker-react";
import LandlordSelector from "./LandlordSelector";
import NumDecksSelector from "./NumDecksSelector";
import RankSelector from "./RankSelector";
import Kicker from "./Kicker";
import ArrayUtils from "./util/array";
import { IInitializePhase, IPlayer, IPropagatedState } from "./types";
import { WebsocketContext } from "./WebsocketProvider";

import Header from "./Header";
import Players from "./Players";
import { GameScoringSettings } from "./ScoringSettings";

const Picker = React.lazy(async () => await import("emoji-picker-react"));

interface IDifficultyProps {
  state: IInitializePhase;
  setFriendSelectionPolicy: (v: React.ChangeEvent<HTMLSelectElement>) => void;
  setAdvancementPolicy: (v: React.ChangeEvent<HTMLSelectElement>) => void;
  setHideLandlordsPoints: (v: React.ChangeEvent<HTMLSelectElement>) => void;
  setHidePlayedCards: (v: React.ChangeEvent<HTMLSelectElement>) => void;
  setKittyPenalty: (v: React.ChangeEvent<HTMLSelectElement>) => void;
  setThrowPenalty: (v: React.ChangeEvent<HTMLSelectElement>) => void;
  setPlayTakebackPolicy: (v: React.ChangeEvent<HTMLSelectElement>) => void;
  setBidTakebackPolicy: (v: React.ChangeEvent<HTMLSelectElement>) => void;
}

const contentStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const DifficultySettings = (props: IDifficultyProps): JSX.Element => {
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const s = (
    <>
      <div>
        <label>
          找朋友限制:{" "}
          <select
            value={props.state.propagated.friend_selection_policy}
            onChange={props.setFriendSelectionPolicy}
          >
            <option value="Unrestricted">非主牌</option>
            <option value="HighestCardNotAllowed">
              非主牌且不能指定最大的牌（例如A）
            </option>
          </select>
        </label>
      </div>
      <div>
        <label>
          是否必打的级:{" "}
          <select
            value={props.state.propagated.advancement_policy}
            onChange={props.setAdvancementPolicy}
          >
            <option value="Unrestricted">必打A</option>
            <option value="FullyUnrestricted">无</option>
            <option value="DefendPoints">
              必打5,10,K,A
            </option>
          </select>
        </label>
      </div>
      <div>
        <label>
          得分显示:{" "}
          <select
            value={
              props.state.propagated.hide_landlord_points ? "hide" : "show"
            }
            onChange={props.setHideLandlordsPoints}
          >
            <option value="show">显示所有玩家得分</option>
            <option value="hide">只显示反家得分</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          是否展示打过的牌:{" "}
          <select
            value={props.state.propagated.hide_played_cards ? "hide" : "show"}
            onChange={props.setHidePlayedCards}
          >
            <option value="show">展示</option>
            <option value="hide">不展示</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          抠底得分翻倍:{" "}
          <select
            value={props.state.propagated.kitty_penalty}
            onChange={props.setKittyPenalty}
          >
            <option value="Times">2乘抠底牌数</option>
            <option value="Power">
              2的抠底牌数次幂
            </option>
          </select>
        </label>
      </div>
      <div>
        <label>
          甩牌罚分规则:{" "}
          <select
            value={props.state.propagated.throw_penalty}
            onChange={props.setThrowPenalty}
          >
            <option value="TenPointsPerAttempt">
              甩错每次罚十
            </option>
            <option value="None">不罚</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          可否悔牌:{" "}
          <select
            value={props.state.propagated.play_takeback_policy}
            onChange={props.setPlayTakebackPolicy}
          >
            <option value="NoPlayTakeback">不允许</option>
            <option value="AllowPlayTakeback">允许</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          可否悔亮主牌{" "}
          <select
            value={props.state.propagated.bid_takeback_policy}
            onChange={props.setBidTakebackPolicy}
          >
            <option value="NoBidTakeback">不允许</option>
            <option value="AllowBidTakeback">允许</option>
          </select>
        </label>
      </div>
    </>
  );

  return (
    <div>
      <label>
        难度设置{" "}
        <button
          className="normal"
          onClick={(evt) => {
            evt.preventDefault();
            setModalOpen(true);
          }}
        >
          打开
        </button>
        <ReactModal
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          shouldCloseOnOverlayClick
          shouldCloseOnEsc
          style={{ content: contentStyle }}
        >
          {s}
        </ReactModal>
      </label>
    </div>
  );
};

interface IScoringSettings {
  state: IInitializePhase;
  numDecks: number;
}
const ScoringSettings = (props: IScoringSettings): JSX.Element => {
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  return (
    <div>
      <label>
        升级评分设置:{" "}
        <button
          className="normal"
          onClick={(evt) => {
            evt.preventDefault();
            setModalOpen(true);
          }}
        >
          Open
        </button>
        <ReactModal
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          shouldCloseOnOverlayClick
          shouldCloseOnEsc
          style={{ content: contentStyle }}
        >
          <GameScoringSettings
            params={props.state.propagated.game_scoring_parameters}
            numDecks={props.numDecks}
          />
        </ReactModal>
      </label>
    </div>
  );
};

interface IUncommonSettings {
  state: IInitializePhase;
  setBidPolicy: (v: React.ChangeEvent<HTMLSelectElement>) => void;
  setJokerBidPolicy: (v: React.ChangeEvent<HTMLSelectElement>) => void;
  setShouldRevealKittyAtEndOfGame: (
    v: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  setFirstLandlordSelectionPolicy: (
    v: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  setGameStartPolicy: (v: React.ChangeEvent<HTMLSelectElement>) => void;
  setGameShadowingPolicy: (v: React.ChangeEvent<HTMLSelectElement>) => void;
  setKittyBidPolicy: (v: React.ChangeEvent<HTMLSelectElement>) => void;
}

const UncommonSettings = (props: IUncommonSettings): JSX.Element => {
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const s = (
    <>
      <div>
        <label>
          旁观政策:{" "}
          <select
            value={props.state.propagated.game_shadowing_policy}
            onChange={props.setGameShadowingPolicy}
          >
            <option value="AllowMultipleSessions">
              允许以同名玩家加入进行旁观
            </option>
            <option value="SingleSessionOnly">
              不允许旁观
            </option>
          </select>
        </label>
      </div>
      <div>
        <label>
          开始牌局按钮:{" "}
          <select
            value={props.state.propagated.game_start_policy}
            onChange={props.setGameStartPolicy}
          >
            <option value="AllowAnyPlayer">
              任何玩家均可
            </option>
            <option value="AllowLandlordOnly">
              仅限庄家
            </option>
          </select>
        </label>
      </div>
      <div>
        <label>
          亮主牌定庄规则（刚开始时）:{" "}
          <select
            value={props.state.propagated.first_landlord_selection_policy}
            onChange={props.setFirstLandlordSelectionPolicy}
          >
            <option value="ByWinningBid">
              定主定庄
            </option>
            <option value="ByFirstBid">
              先亮牌定庄
            </option>
          </select>
        </label>
      </div>
      <div>
        <label>
          翻底亮主牌规则:{" "}
          <select
            value={props.state.propagated.kitty_bid_policy}
            onChange={props.setKittyBidPolicy}
          >
            <option value="FirstCard">第一张</option>
            <option value="FirstCardOfLevelOrHighest">
              第一张常主牌或最大的牌
            </option>
          </select>
        </label>
      </div>
      <div>
        <label>
          反主牌规则:{" "}
          <select
            value={props.state.propagated.bid_policy}
            onChange={props.setBidPolicy}
          >
            <option value="JokerOrGreaterLength">
              同数目王牌可反无将
            </option>
            <option value="GreaterLength">
              必须是高数目才可反
            </option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Joker Bid Policy:{" "}
          <select
            value={props.state.propagated.joker_bid_policy}
            onChange={props.setJokerBidPolicy}
          >
            <option value="BothTwoOrMore">
              At least two jokers (or number of decks) to bid no trump
            </option>
            <option value="BothNumDecks">
              All the low or high jokers to bid no trump
            </option>
            <option value="LJNumDecksHJNumDecksLessOne">
              All the low jokers or all but one high joker to bid no trump
            </option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Should Reveal Kitty at End of Game:{" "}
          <select
            value={
              props.state.propagated.should_reveal_kitty_at_end_of_game
                ? "show"
                : "hide"
            }
            onChange={props.setShouldRevealKittyAtEndOfGame}
          >
            <option value="hide">
              Do not reveal contents of the kitty at the end of the game in chat
            </option>
            <option value="show">
              Reveal contents of the kitty at the end of the game in chat
            </option>
          </select>
        </label>
      </div>
    </>
  );
  return (
    <div>
      <label>
        更多设置:{" "}
        <button
          className="normal"
          onClick={(evt) => {
            evt.preventDefault();
            setModalOpen(true);
          }}
        >
          打开
        </button>
        <ReactModal
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          shouldCloseOnOverlayClick
          shouldCloseOnEsc
          style={{ content: contentStyle }}
        >
          {s}
        </ReactModal>
      </label>
    </div>
  );
};

interface IProps {
  state: IInitializePhase;
  name: string;
}

const Initialize = (props: IProps): JSX.Element => {
  const { send } = React.useContext(WebsocketContext);
  const [showPicker, setShowPicker] = React.useState<boolean>(false);
  const setGameMode = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
    evt.preventDefault();
    if (evt.target.value === "Tractor") {
      send({ Action: { SetGameMode: "Tractor" } });
    } else {
      send({
        Action: {
          SetGameMode: {
            FindingFriends: {
              num_friends: null,
            },
          },
        },
      });
    }
  };

  const setNumFriends = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
    evt.preventDefault();
    if (evt.target.value === "") {
      send({
        Action: {
          SetGameMode: {
            FindingFriends: {
              num_friends: null,
            },
          },
        },
      });
    } else {
      const num = parseInt(evt.target.value, 10);
      send({
        Action: {
          SetGameMode: {
            FindingFriends: {
              num_friends: num,
            },
          },
        },
      });
    }
  };

  const setKittySize = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
    evt.preventDefault();
    if (evt.target.value !== "") {
      const size = parseInt(evt.target.value, 10);
      send({
        Action: {
          SetKittySize: size,
        },
      });
    } else {
      send({
        Action: {
          SetKittySize: null,
        },
      });
    }
  };

  const setFriendSelectionPolicy = (
    evt: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    if (evt.target.value !== "") {
      send({
        Action: {
          SetFriendSelectionPolicy: evt.target.value,
        },
      });
    }
  };

  const setFirstLandlordSelectionPolicy = (
    evt: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    if (evt.target.value !== "") {
      send({
        Action: {
          SetFirstLandlordSelectionPolicy: evt.target.value,
        },
      });
    }
  };

  const setBidPolicy = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
    evt.preventDefault();
    if (evt.target.value !== "") {
      send({
        Action: {
          SetBidPolicy: evt.target.value,
        },
      });
    }
  };
  const setJokerBidPolicy = (
    evt: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    if (evt.target.value !== "") {
      send({
        Action: {
          SetJokerBidPolicy: evt.target.value,
        },
      });
    }
  };

  const setShouldRevealKittyAtEndOfGame = (
    evt: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    if (evt.target.value !== "") {
      send({
        Action: {
          SetShouldRevealKittyAtEndOfGame: evt.target.value === "show",
        },
      });
    }
  };

  const setKittyTheftPolicy = (
    evt: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    if (evt.target.value !== "") {
      send({
        Action: {
          SetKittyTheftPolicy: evt.target.value,
        },
      });
    }
  };

  const setKittyPenalty = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
    evt.preventDefault();
    if (evt.target.value !== "") {
      send({
        Action: {
          SetKittyPenalty: evt.target.value,
        },
      });
    } else {
      send({
        Action: {
          SetKittyPenalty: null,
        },
      });
    }
  };

  const setKittyBidPolicy = (
    evt: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    if (evt.target.value !== "") {
      send({
        Action: {
          SetKittyBidPolicy: evt.target.value,
        },
      });
    }
  };

  const setTrickDrawPolicy = (
    evt: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    if (evt.target.value !== "") {
      send({
        Action: {
          SetTrickDrawPolicy: evt.target.value,
        },
      });
    }
  };

  const setThrowEvaluationPolicy = (
    evt: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    if (evt.target.value !== "") {
      send({
        Action: {
          SetThrowEvaluationPolicy: evt.target.value,
        },
      });
    }
  };

  const setPlayTakebackPolicy = (
    evt: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    if (evt.target.value !== "") {
      send({
        Action: {
          SetPlayTakebackPolicy: evt.target.value,
        },
      });
    }
  };

  const setGameShadowingPolicy = (
    evt: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    if (evt.target.value !== "") {
      send({
        Action: {
          SetGameShadowingPolicy: evt.target.value,
        },
      });
    }
  };

  const setGameStartPolicy = (
    evt: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    if (evt.target.value !== "") {
      send({
        Action: {
          SetGameStartPolicy: evt.target.value,
        },
      });
    }
  };

  const setAdvancementPolicy = (
    evt: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    if (evt.target.value !== "") {
      send({
        Action: {
          SetAdvancementPolicy: evt.target.value,
        },
      });
    } else {
      send({
        Action: {
          SetAdvancementPolicy: "Unrestricted",
        },
      });
    }
  };

  const setBidTakebackPolicy = (
    evt: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    if (evt.target.value !== "") {
      send({
        Action: {
          SetBidTakebackPolicy: evt.target.value,
        },
      });
    }
  };

  const setThrowPenalty = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
    evt.preventDefault();
    if (evt.target.value !== "") {
      send({
        Action: {
          SetThrowPenalty: evt.target.value,
        },
      });
    } else {
      send({
        Action: {
          SetThrowPenalty: null,
        },
      });
    }
  };

  const setHideLandlordsPoints = (
    evt: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    send({ Action: { SetHideLandlordsPoints: evt.target.value === "hide" } });
  };

  const setHidePlayedCards = (
    evt: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    send({ Action: { SetHidePlayedCards: evt.target.value === "hide" } });
  };

  const startGame = (evt: React.SyntheticEvent): void => {
    evt.preventDefault();
    send({ Action: "StartGame" });
  };

  const setEmoji = (evt: MouseEvent, emojiObject: IEmojiData | null): void => {
    evt.preventDefault();
    send({
      Action: {
        SetLandlordEmoji:
          emojiObject !== undefined && emojiObject !== null
            ? emojiObject.emoji
            : null,
      },
    });
  };

  const modeAsString =
    props.state.propagated.game_mode === "Tractor"
      ? "Tractor"
      : "FindingFriends";
  const numFriends =
    props.state.propagated.game_mode === "Tractor" ||
    props.state.propagated.game_mode.FindingFriends.num_friends === null
      ? ""
      : props.state.propagated.game_mode.FindingFriends.num_friends;
  const decksEffective =
    props.state.propagated.num_decks !== undefined &&
    props.state.propagated.num_decks !== null &&
    props.state.propagated.num_decks > 0
      ? props.state.propagated.num_decks
      : Math.max(Math.floor(props.state.propagated.players.length / 2), 1);
  const kittyOffset =
    (decksEffective * 54) % props.state.propagated.players.length;

  let currentPlayer = props.state.propagated.players.find(
    (p: IPlayer) => p.name === props.name
  );
  if (currentPlayer === undefined) {
    currentPlayer = props.state.propagated.observers.find(
      (p) => p.name === props.name
    );
  }

  const landlordIndex = props.state.propagated.players.findIndex(
    (p) => p.id === props.state.propagated.landlord
  );
  const saveGameSettings = (evt: React.SyntheticEvent): void => {
    evt.preventDefault();
    localStorage.setItem(
      "gameSettingsInLocalStorage",
      JSON.stringify(props.state.propagated)
    );
  };

  const setGameSettings = (gameSettings: IPropagatedState): void => {
    if (gameSettings !== null) {
      let kittySizeSet = false;
      let kittySize = null;
      for (const [key, value] of Object.entries(gameSettings)) {
        switch (key) {
          case "game_mode":
            send({
              Action: {
                SetGameMode: value,
              },
            });
            break;
          case "num_decks":
            send({
              Action: {
                SetNumDecks: value,
              },
            });
            if (kittySizeSet) {
              // reset the size again, as setting deck num resets kitty_size to default
              send({
                Action: {
                  SetKittySize: kittySize,
                },
              });
            }
            break;
          case "kitty_size":
            send({
              Action: {
                SetKittySize: value,
              },
            });
            kittySizeSet = true;
            kittySize = value;
            break;
          case "friend_selection_policy":
            send({
              Action: {
                SetFriendSelectionPolicy: value,
              },
            });
            break;
          case "first_landlord_selection_policy":
            send({
              Action: {
                SetFirstLandlordSelectionPolicy: value,
              },
            });
            break;
          case "hide_landlord_points":
            send({
              Action: {
                SetHideLandlordsPoints: value,
              },
            });
            break;
          case "hide_played_cards":
            send({ Action: { SetHidePlayedCards: value } });
            break;
          case "advancement_policy":
            send({
              Action: {
                SetAdvancementPolicy: value,
              },
            });
            break;
          case "kitty_bid_policy":
            send({
              Action: {
                SetKittyBidPolicy: value,
              },
            });
            break;
          case "kitty_penalty":
            send({
              Action: {
                SetKittyPenalty: value,
              },
            });
            break;
          case "kitty_theft_policy":
            send({
              Action: {
                SetKittyTheftPolicy: value,
              },
            });
            break;
          case "throw_penalty":
            send({
              Action: {
                SetThrowPenalty: value,
              },
            });
            break;
          case "trick_draw_policy":
            send({
              Action: {
                SetTrickDrawPolicy: value,
              },
            });
            break;
          case "throw_evaluation_policy":
            send({
              Action: {
                SetThrowEvaluationPolicy: value,
              },
            });
            break;
          case "landlord_emoji":
            send({
              Action: {
                SetLandlordEmoji: value,
              },
            });
            break;
          case "bid_policy":
            send({
              Action: {
                SetBidPolicy: value,
              },
            });
            break;
          case "joker_bid_policy":
            send({
              Action: {
                SetJokerBidPolicy: value,
              },
            });
            break;
          case "should_reveal_kitty_at_end_of_game":
            send({
              Action: {
                SetShouldRevealKittyAtEndOfGame: value,
              },
            });
            break;
          case "game_scoring_parameters":
            send({
              Action: {
                SetGameScoringParameters: value,
              },
            });
            break;
          case "play_takeback_policy":
            send({
              Action: {
                SetPlayTakebackPolicy: value,
              },
            });
            break;
          case "bid_takeback_policy":
            send({
              Action: {
                SetBidTakebackPolicy: value,
              },
            });
            break;
          case "game_shadowing_policy":
            send({
              Action: {
                SetGameShadowingPolicy: value,
              },
            });
            break;
          case "game_start_policy":
            send({
              Action: {
                SetGameStartPolicy: value,
              },
            });
            break;
        }
      }
    }
  };

  const loadGameSettings = (evt: React.SyntheticEvent): void => {
    evt.preventDefault();
    const settings = localStorage.getItem("gameSettingsInLocalStorage");
    if (settings !== null) {
      let gameSettings: IPropagatedState;
      try {
        gameSettings = JSON.parse(settings);

        const fetchAsync = async (): Promise<void> => {
          const fetchResult = await fetch("default_settings.json");
          const fetchJSON = await fetchResult.json();
          const combined = { ...fetchJSON, ...gameSettings };
          if (
            combined.bonus_level_policy !== undefined &&
            combined.game_scoring_parameters !== undefined &&
            combined.bonus_level_policy !==
              combined.game_scoring_parameters.bonus_level_policy
          ) {
            combined.game_scoring_parameters.bonus_level_policy =
              combined.bonus_level_policy;
          }
          setGameSettings(combined);
        };

        fetchAsync().catch((e) => {
          console.error(e);
          localStorage.setItem(
            "gameSettingsInLocalStorage",
            JSON.stringify(props.state.propagated)
          );
        });
      } catch (err) {
        localStorage.setItem(
          "gameSettingsInLocalStorage",
          JSON.stringify(props.state.propagated)
        );
      }
    }
  };

  const resetGameSettings = (evt: React.SyntheticEvent): void => {
    evt.preventDefault();

    const fetchAsync = async (): Promise<void> => {
      const fetchResult = await fetch("default_settings.json");
      const fetchJSON = await fetchResult.json();
      setGameSettings(fetchJSON);
    };

    fetchAsync().catch((e) => console.error(e));
  };

  return (
    <div>
      <Header
        gameMode={props.state.propagated.game_mode}
        chatLink={props.state.propagated.chat_link}
      />
      <Players
        players={props.state.propagated.players}
        observers={props.state.propagated.observers}
        landlord={props.state.propagated.landlord}
        next={null}
        movable={true}
        name={props.name}
      />
      <p>
        把此链接发给其他玩家来加入牌局:{" "}
        <a href={window.location.href} target="_blank" rel="noreferrer">
          <code>{window.location.href}</code>
        </a>
      </p>
      {props.state.propagated.players.length >= 4 ? (
        <button
          disabled={
            props.state.propagated.game_start_policy === "AllowLandlordOnly" &&
            landlordIndex !== -1 &&
            props.state.propagated.players[landlordIndex].name !== props.name
          }
          onClick={startGame}
        >
          开始牌局
        </button>
      ) : (
        <h2>等待玩家...</h2>
      )}
      <Kicker
        players={props.state.propagated.players}
        onKick={(playerId: number) => send({ Kick: playerId })}
      />
      <div className="game-settings">
        <h3>牌局设置</h3>
        <div>
          <label>
            牌局模式:{" "}
            <select value={modeAsString} onChange={setGameMode}>
              <option value="FindingFriends">找朋友</option>
              <option value="Tractor">升级</option>
            </select>
          </label>
        </div>
        <div>
          {props.state.propagated.game_mode !== "Tractor" ? (
            <label>
              朋友数:{" "}
              <select value={numFriends} onChange={setNumFriends}>
                <option value="">预设</option>
                {ArrayUtils.range(
                  Math.max(
                    Math.floor(props.state.propagated.players.length / 2) - 1,
                    0
                  ),
                  (idx) => (
                    <option value={idx + 1} key={idx}>
                      {idx + 1}
                    </option>
                  )
                )}
              </select>
            </label>
          ) : null}
        </div>
        <NumDecksSelector
          numPlayers={props.state.propagated.players.length}
          numDecks={props.state.propagated.num_decks}
          onChange={(newNumDecks: number | null) =>
            send({ Action: { SetNumDecks: newNumDecks } })
          }
        />
        <div>
          <label>
            底牌数:{" "}
            <select
              value={
                props.state.propagated.kitty_size !== undefined &&
                props.state.propagated.kitty_size !== null
                  ? props.state.propagated.kitty_size
                  : ""
              }
              onChange={setKittySize}
            >
              <option value="">预设</option>
              <option value={kittyOffset}>{kittyOffset}张</option>
              <option
                value={kittyOffset + props.state.propagated.players.length}
              >
                {kittyOffset + props.state.propagated.players.length}张
              </option>
              <option
                value={kittyOffset + 2 * props.state.propagated.players.length}
              >
                {kittyOffset + 2 * props.state.propagated.players.length}张
              </option>
              <option
                value={kittyOffset + 3 * props.state.propagated.players.length}
              >
                {kittyOffset + 3 * props.state.propagated.players.length}张
              </option>
            </select>
          </label>
        </div>
        <div>
          <label>
            是否炒地皮:{" "}
            <select
              value={props.state.propagated.kitty_theft_policy}
              onChange={setKittyTheftPolicy}
            >
              <option value="AllowKittyTheft">炒</option>
              <option value="NoKittyTheft">不炒</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            套牌保护规则:{" "}
            <select
              value={props.state.propagated.trick_draw_policy}
              onChange={setTrickDrawPolicy}
            >
              <option value="LongerTuplesProtected">
                保护高阶套牌（三个不必跟对子，等等）
              </option>
              <option value="NoProtections">不保护高阶套牌</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            甩牌比较规则:{" "}
            <select
              value={props.state.propagated.throw_evaluation_policy}
              onChange={setThrowEvaluationPolicy}
            >
              <option value="All">
                所有阶的套牌都要为大
              </option>
              <option value="Highest">
                最高阶的套牌为大即可
              </option>
              <option value="TrickUnitLength">
                Subsequent throw must beat largest component to win
              </option>
            </select>
          </label>
        </div>
        <ScoringSettings state={props.state} numDecks={decksEffective} />
        <UncommonSettings
          state={props.state}
          setBidPolicy={setBidPolicy}
          setJokerBidPolicy={setJokerBidPolicy}
          setShouldRevealKittyAtEndOfGame={setShouldRevealKittyAtEndOfGame}
          setFirstLandlordSelectionPolicy={setFirstLandlordSelectionPolicy}
          setGameStartPolicy={setGameStartPolicy}
          setGameShadowingPolicy={setGameShadowingPolicy}
          setKittyBidPolicy={setKittyBidPolicy}
        />
        <DifficultySettings
          state={props.state}
          setFriendSelectionPolicy={setFriendSelectionPolicy}
          setAdvancementPolicy={setAdvancementPolicy}
          setHideLandlordsPoints={setHideLandlordsPoints}
          setHidePlayedCards={setHidePlayedCards}
          setKittyPenalty={setKittyPenalty}
          setThrowPenalty={setThrowPenalty}
          setPlayTakebackPolicy={setPlayTakebackPolicy}
          setBidTakebackPolicy={setBidTakebackPolicy}
        />
        <h3>继续牌局设置</h3>
        <LandlordSelector
          players={props.state.propagated.players}
          landlordId={props.state.propagated.landlord}
          onChange={(newLandlord: number | null) =>
            send({ Action: { SetLandlord: newLandlord } })
          }
        />
        <RankSelector
          rank={currentPlayer.level}
          onChangeRank={(newRank: string) =>
            send({ Action: { SetRank: newRank } })
          }
        />
        <h3>其他设置</h3>
        <div>
          <label>
            庄家标签:{" "}
            {props.state.propagated.landlord_emoji !== null &&
            props.state.propagated.landlord_emoji !== undefined &&
            props.state.propagated.landlord_emoji !== ""
              ? props.state.propagated.landlord_emoji
              : "当庄"}{" "}
            <button
              className="normal"
              onClick={() => {
                showPicker ? setShowPicker(false) : setShowPicker(true);
              }}
            >
              {showPicker ? "关闭" : "挑选"}
            </button>
            <button
              className="normal"
              disabled={props.state.propagated.landlord_emoji == null}
              onClick={() => {
                send({ Action: { SetLandlordEmoji: null } });
              }}
            >
              预设
            </button>
            {showPicker ? (
              <React.Suspense fallback={"..."}>
                <Picker onEmojiClick={setEmoji} />
              </React.Suspense>
            ) : null}
          </label>
        </div>
        <div>
          <label>
            设置管理:
            <button
              className="normal"
              data-tip
              data-for="saveTip"
              onClick={saveGameSettings}
            >
              保存设置
            </button>
            <ReactTooltip id="saveTip" place="top" effect="solid">
              保存牌局设置
            </ReactTooltip>
            <button
              className="normal"
              data-tip
              data-for="loadTip"
              onClick={loadGameSettings}
            >
              加载设置
            </button>
            <ReactTooltip id="loadTip" place="top" effect="solid">
              加载牌局设置
            </ReactTooltip>
            <button
              className="normal"
              data-tip
              data-for="resetTip"
              onClick={resetGameSettings}
            >
              重新设置
            </button>
            <ReactTooltip id="resetTip" place="top" effect="solid">
              重新牌局设置
            </ReactTooltip>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Initialize;