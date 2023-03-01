import { WINDOW_NAMES } from 'app/constants'

function obtainWindow(name: string): Promise<string> {
  return new Promise((resolve, reject) => {
    overwolf.windows.obtainDeclaredWindow(name, (response) => {
      if (response.status !== 'success') reject(response)
      resolve(response.window.id)
    })
  })
}

interface IMonitor {
  name: string
  id: string
  x: number
  y: number
  width: number
  height: number
  is_primary: boolean
  handle: {
    value: number
  }
}
interface IDisplays {
  success: boolean
  displays: IMonitor[]
}

function getMonitorsList(): Promise<IDisplays> {
  return new Promise((resolve, reject) => {
    //@ts-ignore
    overwolf.utils.getMonitorsList((displays: IDisplays) => {
      if (displays.success) resolve(displays)
      else reject()
    })
  })
}

function onAppRelaunch(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const { displays } = await getMonitorsList()
      if (displays.length > 1) {
        const windowID = await obtainWindow(WINDOW_NAMES.DESKTOP)
        overwolf.windows.restore(windowID, (result) => {
          if (result.status === 'success') resolve()
          else reject(result)
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}
export function registerAppLaunchTriggerHandler() {
  overwolf.extensions.onAppLaunchTriggered.removeListener(onAppRelaunch)
  overwolf.extensions.onAppLaunchTriggered.addListener(onAppRelaunch)
}
