import { FC, useState, useCallback, useEffect } from 'react'
import { WINDOW_NAMES, CONFIG_HOOKS } from 'app/constants'
import { useWindow, useDrag } from 'overwolf-hooks'
import { SVGComponent } from './DesktopHeaderSVG'
import style from './DesktopHeader.module.css'
import { Alert, Modal } from 'antd'
import { useHistory } from 'react-router-dom'
import GTIcon from './GT-Icon.svg'

const { DESKTOP, BACKGROUND } = WINDOW_NAMES
export const DesktopHeader: FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [desktopWindow] = useWindow(DESKTOP, CONFIG_HOOKS)
    const [backgroundWindow] = useWindow(BACKGROUND, CONFIG_HOOKS)
    const { onDragStart, onMouseMove, setCurrentWindowID } = useDrag(
        null,
        CONFIG_HOOKS,
    )

    const history = useHistory()

    const updateDragWindow = useCallback(() => {
        if (desktopWindow?.id) setCurrentWindowID(desktopWindow.id)
    }, [desktopWindow, setCurrentWindowID])

    useEffect(() => {
        updateDragWindow()
    }, [updateDragWindow])

    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleOk = () => {
        setIsModalVisible(false)
        backgroundWindow?.close()
    }

    const handleCancel = () => {
        setIsModalVisible(false)
        desktopWindow?.minimize()
    }

    //{const handleOpenEmail = () => {
    // overwolf.utils.openUrlInDefaultBrowser('mailto:hello@gamersxp.io')
    // overwolf.utils.openUrlInOverwolfBrowser('mailto:hello@gamersxp.io')
  //}}

  return (
    <>
      <SVGComponent />

      <Modal
        title="Exit the dApp?"
        visible={isModalVisible}
        onOk={handleOk}
        cancelText="Minimize"
        okText="Exit"
        okType="primary"
        onCancel={handleCancel}
      >
        <Alert
          message="Warning"
          description="Exiting the dApp will close the current window and any active challenges might be lost. Are you sure?"
          type="warning"
          showIcon
        />
      </Modal>
      <header
        className={style.header}
        onMouseDown={(event) => onDragStart(event)}
        onMouseMove={(event) => onMouseMove(event)}
      >
        <img
          draggable={false}
          src={GTIcon}
          className={style['header-title']}
          alt="gamersxp"
        />
        {/* <h3 className={style['header-title']}>
        </h3> */}
        <div className={style['window-controls-group']}>
          <button
            className={`${style.icon} ${style['window-control']} ${style['window-control-social']} ${style.discord} `}
            onClick={() =>
              overwolf.utils.openUrlInDefaultBrowser(
                'https://discord.gg/mShtnMm3n3',
              )
            }
          >
            <svg>
              <use xlinkHref="#window-control_discord" />
            </svg>
          </button>
                  {/* }<button
            className={`${style.icon} ${style['window-control']} `}
            onClick={handleOpenEmail}
          >
            <svg>
              <use xlinkHref="#social-email" />
            </svg>
          </button>
          <button
            className={`${style.icon} ${style['window-control']}`}
            onClick={() => history.push('settings')}
          >
            <svg>
              <use xlinkHref="#window-control_settings" />
            </svg>
          </button>*/}
        <button
           className={`${style.icon} ${style['window-control']}`}
           onClick={() => history.push('settings')}
           >

           <svg>
           <use xlinkHref="#user" />
           </svg>
        </button>

          <button
            className={`${style.icon} ${style['window-control']}`}
            onClick={() => desktopWindow?.minimize()}
          >
            <svg>
              <use xlinkHref="#window-control_minimize" />
            </svg>
          </button>
          {/* <button
            className={`${style.icon} ${style["toggle-icons"]} ${
              style["window-control"]
            }
            ${maximized && style["toggled"]}`}
            onClick={() => toggleIcon()}
          >
            <svg>
              <use xlinkHref="#window-control_maximize" />
            </svg>
            <svg>
              <use xlinkHref="#window-control_restore" />
            </svg>
          </button> */}
          <button
            className={`${style.icon} ${style['window-control']} ${style['window-control-close']}`}
            onClick={showModal}
          >
            <svg>
              <use xlinkHref="#window-control_close" />
            </svg>
          </button>
        </div>
      </header>
    </>
  )
}
