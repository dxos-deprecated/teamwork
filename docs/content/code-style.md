# Code Style

# ES6

- Use arrow functions over functions.
- Group import statements (third-party, dxos packages, local imports); sort.


## React

- Keep all data manipulation (e.g., generators) separate from UX.
- Use storybooks to develop and test components (speeds up development, 
  and forces reduction in complexity -- e.g., no hooks).
- Build smaller dumb components (pass in data and handlers).
- Components must never import Containers (no cyclic dependencies between components <=> containers).
- Containers should be top-level and use hooks to get system data objects (e.g., `useParties`). 
- As a general rule all UX display and interactions should be in components; the provision of data, 
  and coordination with other objects should be in containers.
- React components should have default exports (e.g., `export default MyComponent`).
- Component handler properties should be `onXXX`, whereas handlers within functions should be `handleXXX`.
- Aggressively factor out common components or functions.
- Use `makeStyles` to create class hooks.
- Use material styles.
