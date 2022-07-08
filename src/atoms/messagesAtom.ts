import { atom } from 'recoil'
import MessageType from '../types/MessageType'

const messagesAtom = atom<MessageType[]>({
  key: 'messagesAtom',
  default: [],
})

export default messagesAtom
