/**
 * Translates an API error response into a user-friendly Error object.
 * Matches known error patterns and HTTP status codes to produce clear,
 * actionable messages that tell the user what went wrong and what to do.
 */
export async function extractApiError(
    res: Response,
    fallbackMessage: string,
): Promise<Error> {
    try {
        const body = await res.json();
        const message = toFriendlyMessage(res.status, body.message, body.details);
        return new Error(message);
    } catch {
        return new Error(toFriendlyMessage(res.status));
    }
}

function toFriendlyMessage(
    status: number,
    apiMessage?: string,
    apiDetails?: string,
): string {
    const combined = `${apiMessage ?? ""} ${apiDetails ?? ""}`.toLowerCase();

    // --- Pattern-based matches (most specific first) ---

    if (combined.includes("limit exceeded") || combined.includes("limit_exceeded")) {
        return "You've reached the maximum number of items allowed. Please remove an existing item before adding a new one.";
    }

    if (combined.includes("image") && combined.includes("required")) {
        return "An image is required. Please upload one before submitting.";
    }

    if (combined.includes("not found") || combined.includes("does not exist")) {
        return "This item could not be found — it may have been deleted. Try refreshing the page.";
    }

    // --- Status-code fallbacks ---

    switch (status) {
        case 400:
            return "Some required information is missing or incorrect. Please check all fields and try again.";
        case 404:
            return "This item could not be found — it may have been deleted. Try refreshing the page.";
        case 409:
            return "This action conflicts with the current state. Please refresh the page and try again.";
        case 422:
            return "Some of the information you entered isn't valid. Please review your inputs and try again.";
        case 429:
            return "You're sending requests too quickly. Please wait a moment and try again.";
        case 500:
        default:
            return "Something unexpected went wrong on our end. Please try again, and if the problem persists, contact support.";
    }
}
