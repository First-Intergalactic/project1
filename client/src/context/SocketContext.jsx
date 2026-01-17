import { createContext, useContext } from 'react'

const SocketContext = createContext({ socket: null, connected: false })

export function SocketProvider({ children }) {
  // Socket временно отключён
  return (
    <SocketContext.Provider value={{ socket: null, connected: false }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  return useContext(SocketContext)
}
