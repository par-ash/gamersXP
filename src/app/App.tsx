import { FC, useEffect, useState } from "react";
import { DesktopWindow } from "pages/DesktopWindow";
import { BackgroundWindow } from "pages/BackgroundWindow";
import { WINDOW_NAMES } from "./constants";

const { BACKGROUND, DESKTOP } = WINDOW_NAMES;

const CurrentPage = ({ page }: { page: string }): JSX.Element => {
  switch (page) {
    case BACKGROUND:
      return <BackgroundWindow />;
    case DESKTOP:
      return <DesktopWindow />;

    default:
      return <p>Loading</p>;
  }
};

const getCurrentWindow = (): Promise<string> =>
  new Promise((resolve) =>
    overwolf.windows.getCurrentWindow((result) => {
      resolve(result.window.name);
    })
  );

export const App: FC = (): JSX.Element => {
  const [page, setPage] = useState<string>("");

  useEffect(() => {
    async function preLoad() {
      if (process.env.NODE_ENV === "development") {
        setPage(DESKTOP);
      } else {
        const currentWindow = await getCurrentWindow();
        setPage(currentWindow);
      }
    }
    preLoad();
  }, []);
  return <CurrentPage page={page} />;
};
