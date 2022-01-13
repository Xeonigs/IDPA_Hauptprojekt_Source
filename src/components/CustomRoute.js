import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import { useAuth } from './Auth'

export function PrivateRoute({ component: Component, ...rest }) {
  const { user } = useAuth()

  return (
    <Route
      {...rest}
    render={(props) => {
        return user ? <Component {...props} /> : <Redirect to="/login"/>
    }}
    />
  )
}

export function LoggedOutRoute({ component: Component, ...rest }) {
    const { user } = useAuth()

    return (
        <Route
            {...rest}
    render={(props) => {
        return user ? <Redirect to="/overview"/> : <Component {...props} />
    }}
    />
    )
}
