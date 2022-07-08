import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { IGunUserInstance } from 'gun'
import { useCallback, useState } from 'react'
import { useRecoilState } from 'recoil'
import isLoggedInAtom from './atoms/isLoggedInAtom'
import usernameAtom from './atoms/usernameAtom'

interface ManageUserProps {
  addEnterLeaveMessage: (entered: boolean) => void
  user: IGunUserInstance
}

const ManageUser = ({ addEnterLeaveMessage, user }: ManageUserProps) => {
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useRecoilState(usernameAtom)
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom)
  const [err, setErr] = useState('')

  const auth = useCallback(() => {
    user.auth(username, password, (ack) => {
      if (!('err' in ack)) {
        setIsLoggedIn(true)
        addEnterLeaveMessage(true)
        return setOpen(false)
      }

      setErr(ack.err)
    })
  }, [user, username, password, setIsLoggedIn, addEnterLeaveMessage])

  const disabled = password.length < 8

  return (
    <>
      <Button
        sx={{
          width: 'fit-content',
          alignSelf: 'flex-end',
        }}
        onClick={() => {
          if (!isLoggedIn) {
            return setOpen(true)
          }

          user.leave()
          setIsLoggedIn(false)
          setUsername('')
          setPassword('')
          addEnterLeaveMessage(false)
        }}
        variant="contained"
      >
        {isLoggedIn ? `${username} Exit Chat` : 'Enter Chat'}
      </Button>
      <Dialog fullWidth open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Enter Chat</DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography>
            <i>Login to previously created account, or create a new account</i>
          </Typography>
          <Typography>
            <i>Password must be at least 8 characters</i>
          </Typography>
          <TextField
            label="Username"
            value={username}
            onChange={(evt) => setUsername(evt.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            onChange={(evt) => setPassword(evt.target.value)}
            value={password}
          />
          {err !== '' && <Typography sx={{ color: 'red' }}>{err}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => auth()} disabled={disabled}>
            Login
          </Button>
          <Button
            disabled={disabled}
            onClick={async () => {
              user.create(username, password, (createArg) => {
                if ('ok' in createArg) {
                  return auth()
                }

                return setErr(createArg.err)
              })
            }}
          >
            Sign up
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ManageUser
