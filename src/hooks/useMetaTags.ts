import { useEffect } from "react";

interface MetaTags {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  author?: string;
}

export function useMetaTags(tags: MetaTags) {
  useEffect(() => {
    const baseUrl = window.location.origin;
    const fullUrl = tags.url ? `${baseUrl}${tags.url}` : baseUrl;
    
    // Set page title
    if (tags.title) {
      document.title = `${tags.title} | Par Five Golf Blog`;
    }

    // Helper to create or update meta tag
    const setMetaTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    const setOGTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Set meta tags
    if (tags.description) {
      setMetaTag("description", tags.description);
      setOGTag("og:description", tags.description);
    }

    // Open Graph tags
    setOGTag("og:type", tags.type || "website");
    setOGTag("og:url", fullUrl);
    
    if (tags.title) {
      setOGTag("og:title", tags.title);
    }

    if (tags.image) {
      setOGTag("og:image", tags.image.startsWith("http") ? tags.image : `${baseUrl}${tags.image}`);
    }

    // Twitter Card tags
    setMetaTag("twitter:card", "summary_large_image");
    if (tags.title) {
      setMetaTag("twitter:title", tags.title);
    }
    if (tags.description) {
      setMetaTag("twitter:description", tags.description);
    }
    if (tags.image) {
      setMetaTag("twitter:image", tags.image.startsWith("http") ? tags.image : `${baseUrl}${tags.image}`);
    }

    // Canonical URL
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", fullUrl);

  }, [tags]);
}