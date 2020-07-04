# Code Style

- Use arrow functions over functions.
- Group import statements (third-party, dxos packages, local imports); sort.


## UX

- Use storybooks to develop and test components (speeds up development, 
  and forces reduction in complexity -- e.g., no hooks).
- All react components should be exported with export default MyComponents.
- Build dumb components (pass in data and handlers).
- Component handler properties should be `onXXX`, whereas handlers within functions should be `handleXXX`.
- Containers use hooks to get system data objects (e.g., useParties). 
- Components must never import Containers (no cyclic dependencies between components <=> containers).
- As a general rule all UX display and interactions should be in components; the provision of data, 
  and coordination with other objects should be in components.
- Aggressively factor out common components or functions.
- Use `makeStyles` to create class hooks.
- Use material styles.
