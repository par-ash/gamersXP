import { FC } from 'react'
import { Typography } from 'antd'

const { Text } = Typography

export const EllipsisMiddle: FC<{ suffixCount: number; copyable: boolean }> = ({
  suffixCount,
  children,
  copyable,
}) => {
  //@ts-ignore
  const suffix = children.slice(-suffixCount).trim()
  return (
    <Text
      style={{ maxWidth: '100%' }}
      ellipsis={{ suffix }}
      type="secondary"
      copyable={copyable}
    >
      {children}
    </Text>
  )
}
