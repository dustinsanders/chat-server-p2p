import { atom } from 'recoil'

const usernameAtom = atom<string>({
  key: 'usernameAtom',
  default: '',
})

export default usernameAtom
