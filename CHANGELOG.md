# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- Shell for canvas app.


### TODO

- Upgrade interactive.

- Standardize WRN (pads, type)
  - standard file layout (e.g., components/containers)
  - remove default export for pad
  - pad.yml
  - standardize CSS (e.g., flex not width: 100%)
  - if () {} lint rules
  - standard defaults (e.g., title)
  - check tutorials conform to patterns

- Rename planner => kanban
- Test offline (e.g., registry HTTP).
- Error handling (show in toolbar -- not popup).
- Error: react_devtools_backend.js:2450 Warning: Can't perform a React state update on an unmounted component. 
  This is a no-op, but it indicates a memory leak in your application. 
  To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
  in PartyCardContainer (created by Home)
