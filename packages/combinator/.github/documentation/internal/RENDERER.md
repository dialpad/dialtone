# Renderer

The renderer is responsible for displaying the target component in its current state.

## Component

The renderer receives the target component as a prop and renders it with a dynamic component (`<component />`). 

## Bindings

The binding members are attached to the dynamic component using `v-bind`.

## Events

The event members are attached to the dynamic component using `v-on`.

## Slots

The slots members are filtered to exclude empty slots, 
they are then inserted in the dynamic component and rendered using a template (`<template />`).