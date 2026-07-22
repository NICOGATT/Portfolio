const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as
  | string
  | undefined

declare global {
  interface Window {
    dataLayer?: IArguments[]
    gtag?: (...args: unknown[]) => void
  }
}

class AnalyticsService {
  private initialized = false

  initialize(): void {
    if (
      this.initialized ||
      !measurementId ||
      typeof window === 'undefined' ||
      typeof document === 'undefined'
    ) {
      return
    }

    window.dataLayer ??= []

    window.gtag = function (..._args: unknown[]) {
      window.dataLayer ??= []
      window.dataLayer.push(arguments)
    }

    const existingScript = document.querySelector(
      `script[data-analytics="${measurementId}"]`,
    )

    if (!existingScript) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      script.dataset.analytics = measurementId
      document.head.appendChild(script)
    }

    window.gtag('js', new Date())

    window.gtag('config', measurementId, {
      send_page_view: false,
    })

    this.initialized = true
  }

  trackPageView(path: string, title: string): void {
    if (!measurementId || !window.gtag) return

    window.gtag('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: title,
      send_to: measurementId,
    })
  }

  trackEvent(
    eventName: string,
    parameters: Record<string, string | number | boolean> = {},
  ): void {
    if (!measurementId || !window.gtag) return

    window.gtag('event', eventName, {
      ...parameters,
      send_to: measurementId,
    })
  }
}

export const analytics = new AnalyticsService()