import * as THREE from 'three';
import { FC } from 'react';
import { OmitByValue } from 'utility-types';
import { ReactThreeFiber } from '../';
declare type Three = typeof import('three');
declare type MissingInThreeRuntimeExports = THREE.AnimationAction | THREE.DirectGeometry | THREE.WebGLClipping | THREE.WebGLInfo | THREE.WebGLProperties | THREE.WebGLRenderList | THREE.WebGLRenderLists | THREE.WebGLColorBuffer | THREE.WebGLDepthBuffer | THREE.WebGLStencilBuffer;
declare type InterestingThreeExports = OmitByValue<Three, MissingInThreeRuntimeExports | THREE.BufferAttribute>;
declare type __ThreeFiberComponents = {
    [P in keyof InterestingThreeExports]: Three[P] extends new (...args: any) => any ? InstanceType<Three[P]> extends InstanceType<Three['Object3D']> ? FC<ReactThreeFiber.Object3DNode<InstanceType<Three[P]>, Three[P]>> : InstanceType<Three[P]> extends InstanceType<Three['Geometry']> ? FC<ReactThreeFiber.GeometryNode<InstanceType<Three[P]>, Three[P]>> : InstanceType<Three[P]> extends InstanceType<Three['BufferGeometry']> ? FC<ReactThreeFiber.BufferGeometryNode<InstanceType<Three[P]>, Three[P]>> : InstanceType<Three[P]> extends InstanceType<Three['Material']> ? FC<ReactThreeFiber.MaterialNode<InstanceType<Three[P]>, Required<ConstructorParameters<Three[P]>>>> : FC<ReactThreeFiber.Node<InstanceType<Three[P]>, Three[P]>> : never;
};
export type { OmitByValue };
export interface ThreeFiberComponents extends OmitByValue<__ThreeFiberComponents, never> {
}