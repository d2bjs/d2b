export interface Padding {
  top: number
  left: number
  right: number
  bottom: number
}

export type Orient = 'top' | 'left' | 'right' | 'bottom'

export type OrientCorner = 'top left' | 'top center' | 'top right' | 'center left' |
                           'center center' | 'center right' | 'bottom center' | 'bottom right'