import { useContext, createContext, useEffect, useState } from 'react'
import { XrplClient } from 'xrpl-client'

const LOCALHOST_URLS = ['localhost', '127.0.0.1', '0.0.0.0']

function isInsecureWs(rippledHost: string | undefined): boolean {
  return (
    !!Number(process.env.VITE_INSECURE_WS) ||
    LOCALHOST_URLS.some((url) => rippledHost?.includes(url)) ||
    rippledHost === ''
  )
}

function getSocket(rippledUrl?: string): XrplClient {
  const rippledHost = rippledUrl ?? process.env.VITE_RIPPLED_HOST
  const prefix = isInsecureWs(rippledHost) ? 'ws' : 'wss'
  const wsUrls: string[] = []
  if (rippledHost?.includes(':')) {
    wsUrls.push(`${prefix}://${rippledHost}`)
  } else {
    wsUrls.push.apply(wsUrls, [
      `${prefix}://${rippledHost}:${process.env.VITE_RIPPLED_WS_PORT}`,
      `${prefix}://${rippledHost}:443`,
    ])
  }
  const socket = new XrplClient(wsUrls)
  const hasP2PSocket =
    process.env.VITE_P2P_RIPPLED_HOST != null &&
    process.env.VITE_P2P_RIPPLED_HOST !== ''
  // @ts-ignore - will be removed eventually
  socket.p2pSocket = hasP2PSocket
    ? new XrplClient([
        `${prefix}://${process.env.VITE_P2P_RIPPLED_HOST}:${process.env.VITE_RIPPLED_WS_PORT}`,
      ])
    : undefined
  return socket
}

const SocketContext = createContext<XrplClient>(undefined!)

/**
 * Hook that says whether or not the global socket is currently connected
 */
const useIsOnline = () => {
  const rippledSocket = useContext(SocketContext)
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    const setIsReadyTrue = () => setIsOnline(true)
    const setIsReadyFalse = () => setIsOnline(false)
    rippledSocket.ready().then(() => {
      setIsReadyTrue()
      rippledSocket.on('online', setIsReadyTrue)
      rippledSocket.on('offline', setIsReadyFalse)
    })
    return () => {
      rippledSocket.off('online', setIsReadyTrue)
      rippledSocket.off('offline', setIsReadyFalse)
    }
  }, [rippledSocket])

  return {
    isOnline,
  }
}

export { getSocket, useIsOnline }

export default SocketContext
