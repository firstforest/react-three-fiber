export * from '../index';
export * from '../canvas';
import React from 'react';
import { ContainerProps } from './shared/web/ResizeContainer';
export * from './shared/web/ResizeContainer';
export declare const Canvas: React.MemoExoticComponent<React.ForwardRefExoticComponent<ContainerProps & React.RefAttributes<HTMLCanvasElement>>>;