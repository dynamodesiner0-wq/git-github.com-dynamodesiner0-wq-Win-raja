
'use client';

import { EventEmitter } from 'events';

/**
 * Global error emitter for Firebase related errors, 
 * especially Security Rules permission issues.
 */
export const errorEmitter = new EventEmitter();
