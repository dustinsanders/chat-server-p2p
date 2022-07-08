import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import isLoggedInAtom from './atoms/isLoggedInAtom'

const RootContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 8px;
`

interface SendMessageProps {
  addMessage: (message: string) => void
}

const SendMessage = ({ addMessage }: SendMessageProps) => {
  const [message, setMessage] = useState('')
  const isLoggedIn = useRecoilValue(isLoggedInAtom)

  return (
    <RootContainer>
      <TextField
        label="New Message"
        value={message}
        onChange={(evt) => setMessage(evt.target.value)}
        fullWidth
        disabled={!isLoggedIn}
        onKeyDown={(evt) => {
          if (evt.key === 'Enter') {
            addMessage(message)
          }
        }}
      />
      <Button
        variant="contained"
        onClick={() => {
          addMessage(message)
        }}
        disabled={!isLoggedIn || message === ''}
      >
        Send
      </Button>
    </RootContainer>
  )
}

export default SendMessage
