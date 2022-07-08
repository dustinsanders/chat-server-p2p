import { atom } from 'recoil'

const isLoggedInAtom = atom<boolean>({
  key: 'isLoggedInAtom',
  default: false,
})

export default isLoggedInAtom
