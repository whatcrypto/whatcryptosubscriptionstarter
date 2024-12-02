import { useLayoutEffect, useRef, useState } from 'react'

interface Size {
  width: number
  height: number
}

function debounce(func: Function) {
  let timer: any
  return function (event: any) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(func, 2000, event)
  }
}

function useElementSize<T extends HTMLElement = HTMLDivElement>(): [
  (node: T | null) => void,
  Size
] {
  const [node, setNode] = useState<T | null>(null)
  const nodeRef = useRef(node)

  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  })

  useLayoutEffect(() => {
    nodeRef.current = node
  }, [node])

  useLayoutEffect(() => {
    const handleSize = () => {
      if (nodeRef.current?.offsetWidth && nodeRef.current?.offsetHeight) {
        setSize({
          width: nodeRef.current?.offsetWidth || 0,
          height: nodeRef.current?.offsetHeight || 0,
        })
      }
    }

    const handleImageLoad = () => {
      if (nodeRef.current) {
        const images = nodeRef.current.querySelectorAll('img')
        images.forEach((image) => {
          image.addEventListener('load', handleSize)
        })
      }
    }

    const debouncedHandler = debounce(handleSize)
    window.addEventListener('resize', debouncedHandler)
    handleSize()
    handleImageLoad()

    return () => {
      window.removeEventListener('resize', debouncedHandler)
      if (nodeRef.current) {
        const images = nodeRef.current.querySelectorAll('img')
        images.forEach((image) => {
          image.removeEventListener('load', handleSize)
        })
      }
    }
  }, [node])

  return [setNode, size]
}

export default useElementSize
