export const extractTicketNode = (ticket: string): string | undefined => {
    const parts = ticket.split("-");
    let index = parts.length;
    while (index > 1 && /^[a-z0-9]+$/.test(parts[index - 1])) {
        index--;
    }
    return index < parts.length ? parts.slice(index).join("-") : undefined;
};

export const affinityHeaders = (ticket: string): Record<string, string> => {
    const node = extractTicketNode(ticket);
    return node ? { Cookie: `SSOSERVERID=${node}` } : {};
};