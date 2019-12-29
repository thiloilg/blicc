import { ACTION } from '..'

export const MASK = {
  NONE: 0,
  SINGLE: 1,
  ROW: 2,
  COLUMN: 3,
}

export function useSelectAction() {
  function getNormalizedCoordinates(canvasRef, clientX, clientY) {
    const rect = canvasRef.current.getBoundingClientRect()
    return [
      (clientX - rect.left) / canvasRef.current.offsetWidth,
      (clientY - rect.top) / canvasRef.current.offsetHeight,
    ]
  }

  function calcIsCenter(x, y) {
    return x > 0.25 && x < 0.75 && y > 0.25 && y < 0.75
  }

  function calcIsRim(x, y) {
    return !(x > 0.125 && x < 0.875 && y > 0.125 && y < 0.875)
  }

  function getDirection(x, y) {
    if (x > y) {
      return x + y < 1 ? ACTION.TOP : ACTION.RIGHT
    } else {
      return x + y >= 1 ? ACTION.BOTTOM : ACTION.LEFT
    }
  }

  function whichAction(canvasRef, event, mask) {
    const [x, y] = getNormalizedCoordinates(
      canvasRef,
      event.clientX,
      event.clientY
    )

    if (x < 0 || x > 1 || y < 0 || y > 1) return ACTION.NONE

    const isCenter = calcIsCenter(x, y)
    const isRim = calcIsRim(x, y)
    const direction = getDirection(x, y)

    switch (mask) {
      case MASK.NONE:
        return ACTION.REPLACE
      case MASK.SINGLE:
        return isCenter ? ACTION.REPLACE : direction
      case MASK.ROW:
        if (isCenter) return ACTION.REPLACE
        if (isRim && direction === ACTION.LEFT) return ACTION.BEFORE
        if (isRim && direction === ACTION.RIGHT) return ACTION.AFTER
        return direction
      case MASK.COLUMN:
        if (isCenter) return ACTION.REPLACE
        if (isRim && direction === ACTION.TOP) return ACTION.BEFORE
        if (isRim && direction === ACTION.BOTTOM) return ACTION.AFTER
        return direction
      default:
        return ACTION.NONE
    }
  }

  return whichAction
}