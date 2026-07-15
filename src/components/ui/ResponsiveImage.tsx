import type { ImgHTMLAttributes } from 'react'
import {
  getCloudinaryImageUrl,
  getCloudinarySrcSet,
  type CloudinaryTransform,
} from '../../utils/cloudinary'

type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> & {
  src: string
  widths: readonly number[]
  transform: Omit<CloudinaryTransform, 'width'>
  fallbackWidth?: number
}

function ResponsiveImage({
  fallbackWidth,
  src,
  transform,
  widths,
  ...imageProps
}: ResponsiveImageProps) {
  const resolvedFallbackWidth = fallbackWidth || widths.at(-1)
  const fallbackSrc = resolvedFallbackWidth
    ? getCloudinaryImageUrl(src, { ...transform, width: resolvedFallbackWidth })
    : src

  return (
    <img
      {...imageProps}
      src={fallbackSrc}
      srcSet={getCloudinarySrcSet(src, widths, transform)}
    />
  )
}

export default ResponsiveImage
