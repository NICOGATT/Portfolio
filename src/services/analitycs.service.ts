    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as
    | string
    | undefined;

    declare global {
    interface Window {
        dataLayer: unknown[];
        gtag?: (...argds: unknown[]) => void;
    }
    }

class AnalitycsService {
    private initialized = false;

    initialize(): void {
        if (
        this.initialized ||
        !measurementId ||
        typeof window === "undefined" ||
        typeof document === "undefined"
        ) {
        return;
        }

        window.dataLayer = window.dataLayer || [];

        window.gtag = (...args: unknown[]) => {
        window.dataLayer.push(args);
        };

        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        script.dataset.analytics = measurementId;

        document.head.appendChild(script);

        window.gtag("js", new Date());
        window.gtag("config", measurementId, {
        send_page_view: false,
        });

        this.initialized = true;
    }

    trackPageView(path: string, title: string): void {
        if (!measurementId || !window.gtag) {
        return;
        }

        window.gtag("event", "page_view", {
        page_path: path,
        page_location: window.location.href,
        page_title: title,
        });
    }

    trackEvent(
        eventName: string,
        parameters: Record<string, string | number | boolean> = {},
    ): void {
        if (!window.gtag) {
        return;
        }

        window.gtag("event", eventName, parameters);
    }

    trackProjectView(projectName: string, projectId?: string): void {
        this.trackEvent("view_project", {
        projectName: projectName,
        ...(projectId ? { project_id: projectId } : {}),
        });
    }

    trackContactForm(): void {
        this.trackEvent("generate_lead", {
        form_name: "portfolio_contact",
        });
    }

    trackWhatsappClick(): void {
        this.trackEvent("click_whatsapp", {
        link_location: window.location.pathname,
        });
    }

    trackGithubClick(repository?: string): void {
        this.trackEvent("click_github", {
        link_location: window.location.pathname,
        ...(repository ? { repository } : {}),
        });
    }
}

export const analytics = new AnalitycsService(); 