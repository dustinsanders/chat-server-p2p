import styled from '@emotion/styled'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useRecoilValue } from 'recoil'
import isLoggedInAtom from './atoms/isLoggedInAtom'
import messagesAtom from './atoms/messagesAtom'
import usernameAtom from './atoms/usernameAtom'

const RootContainer = styled(Paper)`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
  overflow: auto;
  flex: 1;
`

const Message = styled(Box)`
  border-radius: 24px;
  padding: 8px;
  width: fit-content;
`

const MessageSubtext = styled(Typography)`
  font-size: 12px;
  margin: 4px 8px;
`

const Messages = () => {
  const messagesState = useRecoilValue(messagesAtom)
  const username = useRecoilValue(usernameAtom)
  const isLoggedIn = useRecoilValue(isLoggedInAtom)

  return (
    <RootContainer id="messages-container">
      {messagesState.length === 0 && <i>No messages...</i>}
      {messagesState.map((entry, idx) => {
        const previous = messagesState[idx - 1]
        const isPreviousEqual =
          previous &&
          previous.username === entry.username &&
          !('entered' in previous)
        const isActiveUser = isLoggedIn && entry.username === username

        return (
          <Box
            key={entry.id}
            sx={
              isActiveUser
                ? {
                    alignSelf: 'flex-end',
                    textAlign: 'right',
                  }
                : {}
            }
          >
            {'message' in entry ? (
              <>
                {!isPreviousEqual && (
                  <MessageSubtext>{entry.username}</MessageSubtext>
                )}
                <Message
                  sx={{
                    color: isActiveUser ? 'white' : 'auto',
                    background: isActiveUser ? '#1982fc' : '#f2f2f2',
                  }}
                >
                  {entry.message}
                </Message>
              </>
            ) : (
              <MessageSubtext>
                <b>{entry.username}</b> {entry.entered ? 'entered' : 'left'} the
                chat
              </MessageSubtext>
            )}
          </Box>
        )
      })}
    </RootContainer>
  )
}

export default Messages
