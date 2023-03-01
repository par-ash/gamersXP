import { Card, Space } from 'antd'

// import bgLol from 'assets/images/bg-lol.png'
// import lolLogo from 'assets/images/lol-logo.svg'

import logoRocketLeague from 'assets/images/rocket-league-logo.svg'
import logoCSGO from 'assets/images/CSGO-logo.svg'
import logoPUBG from 'assets/images/logo-pubg.svg'
import logoFortnite from 'assets/images/logo-fortnite.svg'

import './GameList.less'

interface IgameListItem {
  id: number
  name: string
  selector: string
  logoImage: string
}
interface IGameCard {
  active: boolean
  setActive: () => void
  gameName: string
  logoImage: string
  selector: string
}

const GameCard = ({
  active,
  setActive,
  gameName,
  logoImage,
  selector,
}: IGameCard) => {
  return (
    <div
      className={`game-card-${selector} ${
        active ? `game-card-active-${selector}` : ''
      }`}
      onClick={setActive}
    >
      <Space
        direction="horizontal"
        style={{
          width: '100%',
        }}
      >
        <img
          src={logoImage}
          alt="lolLogo"
          className={'game-logo'}
          draggable={false}
        />
        <span className="game-name">{gameName}</span>
      </Space>
    </div>
  )
}

interface IGameListProps {
  setCurrentGame: (gameId: number) => void
  currentGame: number
}

const games: IgameListItem[] = [
  {
    id: 10798,
    name: 'Rocket League',
    selector: 'rocket-league',
    logoImage: logoRocketLeague,
  },
  {
    id: 21216,
    name: 'Fortnite',
    selector: 'fortnite',
    logoImage: logoFortnite,
  },
  {
    id: 7764,
    name: 'CS:GO',
    selector: 'csgo',
    logoImage: logoCSGO,
  },
  {
    id: 10906,
    name: 'PUBG',
    selector: 'pubg',
    logoImage: logoPUBG,
  },
]

export const GameList = ({ currentGame, setCurrentGame }: IGameListProps) => {
  return (
    <Card
      type="inner"
      bordered={false}
      style={{
        height: 320,
        borderRadius: 8,
      }}
      bodyStyle={{ padding: 1 }}
      draggable={false}
    >
      <div className="game-container">
        {games.map(({ id, name, logoImage, selector }) => (
          <GameCard
            logoImage={logoImage}
            key={id}
            active={currentGame === id}
            selector={selector}
            gameName={name}
            setActive={() => setCurrentGame(id)}
          />
        ))}
      </div>
    </Card>
  )
}
