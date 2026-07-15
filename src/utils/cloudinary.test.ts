import { describe, expect, it } from 'vitest'
import { getCloudinaryImageUrl, getCloudinarySrcSet, isCloudinaryImageUrl } from './cloudinary'

const optimizedUrl = 'https://res.cloudinary.com/dieyn4pho/image/upload/f_auto,q_auto/v1/portfolio/projects/rkylvbb8bxkbq1o0p54a?_a=BAMAPqfk0'

describe('Cloudinary image URL helpers', () => {
  it('adds a responsive transformation and preserves the source path and query', () => {
    const result = getCloudinaryImageUrl(optimizedUrl, {
      aspectRatio: '2.0',
      crop: 'fill',
      gravity: 'auto',
      width: 640,
    })

    expect(result).toBe(
      'https://res.cloudinary.com/dieyn4pho/image/upload/c_fill,g_auto,ar_2.0,w_640/f_auto,q_auto/v1/portfolio/projects/rkylvbb8bxkbq1o0p54a?_a=BAMAPqfk0',
    )
  })

  it('supports an untransformed Cloudinary URL', () => {
    const result = getCloudinaryImageUrl(
      'https://res.cloudinary.com/demo/image/upload/v1/folder/image.jpg',
      { crop: 'limit', width: 1920 },
    )

    expect(result).toContain('/image/upload/c_limit,w_1920,f_auto,q_auto/v1/folder/image.jpg')
  })

  it('leaves local, data and third-party URLs unchanged', () => {
    const sources = ['/image.webp', 'data:image/png;base64,abc', 'https://example.com/image.jpg']
    for (const source of sources) {
      expect(getCloudinaryImageUrl(source, { crop: 'limit', width: 640 })).toBe(source)
      expect(isCloudinaryImageUrl(source)).toBe(false)
    }
  })

  it('only creates srcset for Cloudinary images', () => {
    const result = getCloudinarySrcSet(optimizedUrl, [320, 640], {
      aspectRatio: '2.0',
      crop: 'fill',
      gravity: 'auto',
    })

    expect(result).toContain('w_320')
    expect(result).toContain('320w')
    expect(result).toContain('w_640')
    expect(result).toContain('640w')
    expect(getCloudinarySrcSet('/local.webp', [320], { crop: 'limit' })).toBeUndefined()
  })
})
