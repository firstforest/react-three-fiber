/* eslint-disable import/named, import/namespace */
import * as React from 'react'
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl'
import {
  View,
  LayoutChangeEvent,
  PixelRatio,
  ViewStyle,
  PanResponder,
  GestureResponderEvent,
  StyleSheet,
} from 'react-native'
import { Renderer } from 'expo-three'
import { useState } from 'react'
import { useCanvas, CanvasProps, UseCanvasProps } from '../../canvas'
import { RectReadOnly } from 'react-use-measure'

function offsetXY(e: GestureResponderEvent) {
  ;(e as any).nativeEvent.offsetX = e.nativeEvent.pageX
  ;(e as any).nativeEvent.offsetY = e.nativeEvent.pageY
  return e
}

const CLICK_DELTA = 20

interface NativeCanvasProps extends CanvasProps {
  style?: ViewStyle
  nativeRef_EXPERIMENTAL?: React.MutableRefObject<any>
  onContextCreated?: (gl: ExpoWebGLRenderingContext) => Promise<any> | void
}

const styles: ViewStyle = { flex: 1 }

const IsReady = React.memo(({ gl, ...props }: NativeCanvasProps & { gl: any; size: any }) => {
  const events = useCanvas({ ...props, gl } as UseCanvasProps)

  const panResponder = React.useMemo(() => {
    let pointerDownCoords: null | [number, number] = null
    return PanResponder.create({
      onStartShouldSetPanResponderCapture(e) {
        events.onGotPointerCaptureLegacy(offsetXY(e))
        return true
      },
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => true,
      onPanResponderStart: (e) => {
        pointerDownCoords = [e.nativeEvent.locationX, e.nativeEvent.locationY]
        events.onPointerDown(offsetXY(e))
      },
      onPanResponderMove: (e) => events.onPointerMove(offsetXY(e)),
      onPanResponderEnd: (e) => {
        events.onPointerUp(offsetXY(e))
        if (pointerDownCoords) {
          const xDelta = pointerDownCoords[0] - e.nativeEvent.locationX
          const yDelta = pointerDownCoords[1] - e.nativeEvent.locationY
          if (Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2)) < CLICK_DELTA) {
            events.onClick(offsetXY(e))
          }
        }
        pointerDownCoords = null
      },
      onPanResponderRelease: (e) => events.onPointerLeave(offsetXY(e)),
      onPanResponderTerminate: (e) => events.onLostPointerCapture(offsetXY(e)),
      onPanResponderReject: (e) => events.onLostPointerCapture(offsetXY(e)),
    })
  }, [events])

  return <View {...panResponder.panHandlers} style={StyleSheet.absoluteFill} collapsable={false} />
})

export const Canvas = React.memo((props: NativeCanvasProps) => {
  const [size, setSize] = useState<RectReadOnly | null>(null)
  const [renderer, setRenderer] = useState<Renderer>()

  // Handle size changes
  const onLayout = (e: LayoutChangeEvent) => {
    const { x, y, width, height } = e.nativeEvent.layout
    setSize({
      x,
      y,
      width,
      height,
      left: x,
      right: x + width,
      top: y,
      bottom: y + height,
    })
  }

  // Fired when EXGL context is initialized
  const onContextCreate = async (gl: ExpoWebGLRenderingContext & WebGLRenderingContext) => {
    if (props.onContextCreated) {
      // Allow customization of the GL Context
      // Useful for AR, VR and others
      await props.onContextCreated(gl)
    }

    if (props.shadowMap) {
      // https://github.com/expo/expo-three/issues/38
      gl.createRenderbuffer = () => ({})
    }

    const pixelRatio = PixelRatio.get()

    const renderer = new Renderer({
      gl,
      width: size!.width / pixelRatio,
      height: size!.height / pixelRatio,
      pixelRatio,
    })

    // Bind previous render method to Renderer
    const rendererRender = renderer.render.bind(renderer)
    renderer.render = (scene, camera) => {
      rendererRender(scene, camera)
      // End frame through the RN Bridge
      gl.endFrameEXP()
    }

    setRenderer(renderer)
  }

  const setNativeRef = (ref: any) => {
    if (props.nativeRef_EXPERIMENTAL && !props.nativeRef_EXPERIMENTAL.current) {
      props.nativeRef_EXPERIMENTAL.current = ref
    }
  }

  // 1. Ensure Size
  // 2. Ensure EXGLContext
  // 3. Call `useCanvas`
  return (
    <View onLayout={onLayout} style={{ ...styles, ...props.style }}>
      {size && (
        <GLView
          nativeRef_EXPERIMENTAL={setNativeRef}
          onContextCreate={onContextCreate}
          style={StyleSheet.absoluteFill}
        />
      )}
      {size && renderer && <IsReady {...props} size={size!} gl={renderer} />}
    </View>
  )
})
