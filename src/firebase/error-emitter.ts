'use client';
import { EventEmitter } from 'events';

/**
 * Global error emitter for Firebase related errors.
 */
export const errorEmitter = new EventEmitter();
