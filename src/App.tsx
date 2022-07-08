import styled from '@emotion/styled'
import Container from '@mui/material/Container'
import { useDebounceCallback } from '@react-hook/debounce'
import Gun from 'gun/gun'
import 'gun/sea'
import { nanoid } from 'nanoid'
import { useCallback, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import isLoggedInAtom from './atoms/isLoggedInAtom'
import messagesAtom from './atoms/messagesAtom'
import usernameAtom from './atoms/usernameAtom'
import ManageUser from './ManageUser'
import Messages from './Messages'
import SendMessage from './SendMessage'
import MessageType from './types/MessageType'

const RootContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 16px;
  padding-bottom: 16px;
  height: 100%;
  overflow: hidden;
`

const shortId = () => nanoid(7)

const gun = Gun({
  peers: ['http://localhost:4040/gun'],
})

const user = gun.user()
const messages = gun.get('messages')

const scrollToBottom = () => {
  const messagesContainer = document.getElementById('messages-container')

  if (messagesContainer) {
    messagesContainer.scroll({ top: 100000, behavior: 'smooth' })
  }
}

const App = () => {
  const [messagesState, setMessagesState] = useRecoilState(messagesAtom)
  const username = useRecoilValue(usernameAtom)
  const isLoggedIn = useRecoilValue(isLoggedInAtom)
  const debouncedScroll = useDebounceCallback(scrollToBottom, 500)

  const addMessage = useCallback(
    (message: string) => {
      const newMessage: MessageType = {
        id: shortId(),
        message,
        username,
        createdAt: Date.now(),
      }

      messages.set(newMessage)
    },
    [username]
  )

  const addEnterLeaveMessage = useCallback(
    (entered: boolean) => {
      const newMessage: MessageType = {
        id: shortId(),
        entered,
        username,
        createdAt: Date.now(),
      }

      messages.set(newMessage)
    },
    [username]
  )

  useEffect(() => {
    messages.map().once((m) => {
      if (!MessageType.is(m)) {
        return
      }

      setMessagesState((curr) => {
        if (messagesState.find((entry) => entry.id === m.id)) {
          return curr
        }

        return [...curr, m].sort((a, b) => a.createdAt - b.createdAt)
      })

      debouncedScroll()
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const beforeUnloadCallback = (evt: BeforeUnloadEvent) => {
      evt.preventDefault()
      if (isLoggedIn) {
        addEnterLeaveMessage(false)
      }
    }

    window.addEventListener('beforeunload', beforeUnloadCallback)
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadCallback)
    }
  }, [addEnterLeaveMessage, addMessage, isLoggedIn, username])

  return (
    <RootContainer>
      <ManageUser addEnterLeaveMessage={addEnterLeaveMessage} user={user} />
      <Messages />
      <SendMessage addMessage={addMessage} />
    </RootContainer>
  )
}

export default App
