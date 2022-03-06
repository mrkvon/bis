import React, { ReactNode } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { setNotification } from './features/notification/notificationSlice'

interface Props extends PropsFromRedux {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class AppErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  /*
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  */

  componentDidCatch(error: Error /*, errorInfo: ErrorInfo*/) {
    // You can also log the error to an error reporting service
    this.setState({ hasError: true })
    this.props.setNotification({
      type: 'error',
      title: error.constructor.name,
      detail: error.message,
      timeout: 0,
    })
  }
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="w-screen h-screen flex flex-col items-center justify-evenly font-bold text-2xl text-center">
          <p>
            Sorry, something went terribly wrong.
            <br />
            Please, let us know.
            <br />
            And reload...
          </p>
        </div>
      )
    }
    return this.props.children
  }
}

const connector = connect(null, { setNotification })

type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(AppErrorBoundary)
