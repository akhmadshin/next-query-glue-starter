import type { IncomingMessage } from 'http';

export const isServerReq = (req: IncomingMessage) => !req.url?.startsWith('/_next');