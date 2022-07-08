import { boolean, Infer, number, string, type, union } from 'superstruct'

const UserMessage = type({
  id: string(),
  username: string(),
  message: string(),
  createdAt: number(),
})

const EnterLeaveMessage = type({
  id: string(),
  username: string(),
  entered: boolean(),
  createdAt: number(),
})

type MessageType = Infer<typeof MessageType>
const MessageType = union([UserMessage, EnterLeaveMessage])

export default MessageType
