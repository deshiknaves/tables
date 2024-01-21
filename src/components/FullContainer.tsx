import { ReactNode } from 'react'
import useMeasure from 'react-use-measure'

type Bounds = ReturnType<typeof useMeasure>[1]
type FullContainerRenderProp = (bounds: Bounds) => ReactNode

type FullContainerProps = {
  children: ReactNode | FullContainerRenderProp
}

export function FullContainer({ children }: FullContainerProps) {
  const [ref, bounds] = useMeasure()
  return (
    <div ref={ref} className="w-full h-full">
      {typeof children === 'function' ? children(bounds) : children}
    </div>
  )
}
