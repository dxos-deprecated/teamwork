# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- Shell for canvas app.


### TODO

- Przemek

- Standardize WRN (pads, type)
  - pad no default export
  - name vs type
  - standard file layout
  - Search: wrn_dxos_org example.com
  - pad.yml
  - test if breaks URLs?
  - exported consts (e.g., from editor)

- Review patterns (see TablePad).
  - Definitions (pad, type, handlers)
  - Standardize CSS
  - if () {} lint rules

- Rename planner => kanban

- Test offline (e.g., registry).
- Error handling (show in toolbar -- not popup).

react_devtools_backend.js:2450 Warning: Can't perform a React state update on an unmounted component. 
This is a no-op, but it indicates a memory leak in your application. 
To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
in PartyCardContainer (created by Home)
