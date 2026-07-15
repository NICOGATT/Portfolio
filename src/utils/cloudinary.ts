export type CloudinaryCrop = 'fill' | 'limit'

export type CloudinaryTransform = {
  width: number
  height?: number
  aspectRatio?: string
  crop?: CloudinaryCrop
  gravity?: 'auto'
}

const CLOUDINARY_UPLOAD_PATH = '/image/upload/'

export const isCloudinaryImageUrl = (value: string) => {
  try {
    const url = new URL(value)
    return url.hostname === 'res.cloudinary.com' && url.pathname.includes(CLOUDINARY_UPLOAD_PATH)
  } catch {
    return false
  }
}

export const getCloudinaryImageUrl = (value: string, transform: CloudinaryTransform) => {
  if (!isCloudinaryImageUrl(value)) return value

  const url = new URL(value)
  const [prefix, assetPath] = url.pathname.split(CLOUDINARY_UPLOAD_PATH)
  if (!assetPath) return value

  const assetSegments = assetPath.split('/')
  const versionIndex = assetSegments.findIndex((segment) => /^v\d+$/.test(segment))
  const existingTransformations = versionIndex > 0 ? assetSegments.slice(0, versionIndex).join(',') : ''
  const hasAutomaticFormat = /(^|,)f_auto(,|$)/.test(existingTransformations)
  const hasAutomaticQuality = /(^|,)q_auto(?::\w+)?(,|$)/.test(existingTransformations)

  const parameters = [
    `c_${transform.crop || 'fill'}`,
    transform.gravity ? `g_${transform.gravity}` : '',
    transform.aspectRatio ? `ar_${transform.aspectRatio}` : '',
    `w_${transform.width}`,
    transform.height ? `h_${transform.height}` : '',
    hasAutomaticFormat ? '' : 'f_auto',
    hasAutomaticQuality ? '' : 'q_auto',
  ].filter(Boolean)

  url.pathname = `${prefix}${CLOUDINARY_UPLOAD_PATH}${parameters.join(',')}/${assetPath}`
  return url.toString()
}

export const getCloudinarySrcSet = (
  value: string,
  widths: readonly number[],
  transform: Omit<CloudinaryTransform, 'width'>,
) => {
  if (!isCloudinaryImageUrl(value)) return undefined

  return widths
    .map((width) => `${getCloudinaryImageUrl(value, { ...transform, width })} ${width}w`)
    .join(', ')
}
