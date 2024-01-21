import clsx from 'clsx'
import { ReactNode } from 'react'
import useMeasure from 'react-use-measure'

type Bounds = ReturnType<typeof useMeasure>[1]
type FullContainerRenderProp = (bounds: Bounds) => ReactNode

type FullContainerProps = {
  className?: string
  children: ReactNode | FullContainerRenderProp
}

export function FullContainer({ className, children }: FullContainerProps) {
  const [ref, bounds] = useMeasure()
  return (
    <div ref={ref} className={clsx('w-full h-full', className)}>
      {typeof children === 'function' ? children(bounds) : children}
    </div>
  )
}
