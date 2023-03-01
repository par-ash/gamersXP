import './overwolf.dev.mock'
import store from 'app/store'
import i18n from 'i18next'
import { resources } from 'locales'

import ReactDOM from 'react-dom'
import { initReactI18next } from 'react-i18next'
import { Provider } from 'react-redux'
import { App } from './app/App'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

interface IInitI18N {
  status: 'success' | 'error'
  language: string
}

const uri =
  process.env.REACT_APP_SUBGRAPH_MODE === 'production' &&
  process.env.NODE_ENV === 'production'
    ? `https://gateway.thegraph.com/api/${process.env.REACT_APP_THEGRAPH_API_KEY}/subgraphs/id/${process.env.REACT_APP_SUBGRAPH_ID}`
    : process.env.REACT_APP_SUBGRAPH_LOCAL
const client = new ApolloClient({
  uri,
  cache: new InMemoryCache(),
})

//@ts-ignore
overwolf.settings.language.get((result: IInitI18N) => {
  i18n.use(initReactI18next).init({
    resources,
    lng: result.language,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })
  ReactDOM.render(
    <ApolloProvider client={client}>
      <Provider store={store}>
        <App />
      </Provider>
    </ApolloProvider>,
    document.getElementById('root'),
  )
})

function changeLanguage({ language }: { language: string }) {
  i18n.changeLanguage(language)
}
//@ts-ignore
overwolf.settings.language.onLanguageChanged.removeListener(changeLanguage)
//@ts-ignore
overwolf.settings.language.onLanguageChanged.addListener(changeLanguage)
