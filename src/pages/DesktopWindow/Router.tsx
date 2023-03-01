import { HashRouter, Switch, Route } from 'react-router-dom'
import { paths } from 'features/menu/paths'
import { FC } from 'react'

export const Router: FC = ({ children }) => {
  return <HashRouter>{children}</HashRouter>
}

export const RouterComponents = () => (
  <Switch>
    {paths.map(({ path, Component }) => (
      <Route key={path} path={path}>
        <Component />
      </Route>
    ))}
  </Switch>
)
