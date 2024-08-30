export function getStrapiURL(path = '') {
    return `${process.env.STRAPI_URL ?? 'http://localhost:1337'}${path}`;
}

export function getSolidURL(path = '') {
    return `${process.env.NEXT_PUBLIC_SOLID_URL ?? 'http://localhost:3000'}${path}`;
}

export function getStrapiMedia(url: string | null) {
    if (!url) {
        return undefined;
    }

    // Return the full URL if the media is hosted on an external provider
    if (url.startsWith('http') || url.startsWith('//')) {
        return url;
    }

    // Otherwise prepend the URL path with the Strapi URL
    return `${getStrapiURL()}${url}`;
}
export function getStrapiMediaURL(hash?: string, ext?: string) {
    if (!hash) {
        return undefined;
    }

    // Return the full URL if the media is hosted on an external provider
    if (hash.startsWith('http') || hash.startsWith('//')) {
        return hash;
    }

    // Otherwise prepend the URL path with the Strapi URL
    return `${getStrapiURL('/uploads/')}${hash}${ext}`;
}

export function formatDate(dateString: string) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
