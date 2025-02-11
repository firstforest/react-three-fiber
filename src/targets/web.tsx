export * from '../index'
export * from '../canvas'

import { WebGLRenderer, WebGL1Renderer } from 'three'
import React, { useEffect, useRef } from 'react'
import { ResizeContainer, ContainerProps } from './shared/web/ResizeContainer'

export * from './shared/web/ResizeContainer'

export const Canvas = React.memo(
  React.forwardRef<HTMLCanvasElement, ContainerProps>(({ children, ...props }, ref) => {
    const canvasRef = ref as React.MutableRefObject<HTMLCanvasElement | null>
    const renderer = props.webgl1 ? WebGL1Renderer : WebGLRenderer
    return (
      <ResizeContainer
        {...props}
        renderer={() => {
          if (canvasRef.current) {
            const params = { antialias: true, alpha: true, ...props.gl }
            const temp = new renderer({
              powerPreference: 'high-performance',
              //stencil: false,
              //depth: false,
              canvas: canvasRef.current,
              ...params,
            })
            return temp
          }
        }}
        preRender={<canvas ref={canvasRef as React.MutableRefObject<HTMLCanvasElement>} style={{ display: 'block' }} />}
      >
        {children}
      </ResizeContainer>
    )
  })
)
