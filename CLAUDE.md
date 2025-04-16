# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands
- `npm install` - Install dependencies
- `npm start` - Start development server with dev client
- `npm run web` - Start development server for web
- `npm run format` - Fix code style issues
- `npm run lint` - Check for code style issues
- `npm run build:dev` - Build for development with EAS
- `npm run build:preview` - Build preview with EAS
- `npm run build:prod` - Build production with EAS

## Code Style Guidelines
- **Formatting**: Use Prettier with 100 char line length, 2 spaces for tabs, single quotes
- **Component Structure**: Follow functional component pattern with named exports
- **Types**: Use TypeScript interfaces, prefer explicit typing over 'any'
- **Error Handling**: Use centralized error service and errorHandler hook
- **State Management**: Use Zustand for global state
- **Imports**: Group imports by: React/libraries > components > hooks > utils/services
- **File Organization**: Group related files in domain-specific folders
- **Naming Conventions**: 
  - PascalCase for components and types
  - camelCase for variables, functions, and instances
  - Use descriptive names that indicate purpose
- **Comments**: Document complex logic and component interfaces with JSDoc format