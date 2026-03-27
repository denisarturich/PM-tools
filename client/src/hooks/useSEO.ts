import { useEffect } from "react";

interface SEOOptions {
  title: string;
  description: string;
  /** Relative path, e.g. "/risk-management". Defaults to "/" */
  path?: string;
  /** Full canonical URL. If omitted, built from SITE_URL + path */
  canonical?: string;
}

const SITE_URL = "https://pm-tools.pro";
const DEFAULT_TITLE = "PM-Tools — AI Prompts, Risk Management & Retrospective Builder for Project Managers";
const DEFAULT_DESCRIPTION =
  "Free toolkit for project managers: ready-made AI prompt templates for every project stage, a risk management board with ROAM, and a retrospective activity builder.";

/**
 * Updates document title, meta description and canonical URL for the current page.
 * Restores previous values on unmount (SPA navigation).
 */
export function useSEO({ title, description, path = "/", canonical }: SEOOptions) {
  useEffect(() => {
    const canonicalUrl = canonical ?? `${SITE_URL}${path}`;

    // ── title ────────────────────────────────────────────────────────────────
    const prevTitle = document.title;
    document.title = title;

    // ── description ──────────────────────────────────────────────────────────
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute("content") ?? "";
    metaDesc?.setAttribute("content", description);

    // ── og:title / og:description / og:url ───────────────────────────────────
    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    const prevOgTitle = ogTitle?.getAttribute("content") ?? "";
    ogTitle?.setAttribute("content", title);

    const ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    const prevOgDesc = ogDesc?.getAttribute("content") ?? "";
    ogDesc?.setAttribute("content", description);

    const ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    const prevOgUrl = ogUrl?.getAttribute("content") ?? "";
    ogUrl?.setAttribute("content", canonicalUrl);

    // ── twitter:title / twitter:description ──────────────────────────────────
    const twTitle = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]');
    const prevTwTitle = twTitle?.getAttribute("content") ?? "";
    twTitle?.setAttribute("content", title);

    const twDesc = document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]');
    const prevTwDesc = twDesc?.getAttribute("content") ?? "";
    twDesc?.setAttribute("content", description);

    // ── canonical ────────────────────────────────────────────────────────────
    let linkCanonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const prevCanonical = linkCanonical?.getAttribute("href") ?? "";
    linkCanonical?.setAttribute("href", canonicalUrl);

    // ── cleanup: restore on unmount ──────────────────────────────────────────
    return () => {
      document.title = prevTitle || DEFAULT_TITLE;
      metaDesc?.setAttribute("content", prevDesc || DEFAULT_DESCRIPTION);
      ogTitle?.setAttribute("content", prevOgTitle || DEFAULT_TITLE);
      ogDesc?.setAttribute("content", prevOgDesc || DEFAULT_DESCRIPTION);
      ogUrl?.setAttribute("content", prevOgUrl || SITE_URL + "/");
      twTitle?.setAttribute("content", prevTwTitle || DEFAULT_TITLE);
      twDesc?.setAttribute("content", prevTwDesc || DEFAULT_DESCRIPTION);
      linkCanonical?.setAttribute("href", prevCanonical || SITE_URL + "/");
    };
  }, [title, description, path, canonical]);
}
