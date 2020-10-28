### Setup:
* You should be testing using 2 machines with 2 different browsers ( Brave / Chrome / Firefox are initial targets ).
* If that's no posssible, use two different profiles of Chrome / Brave on a single machine.
* Reset browser local storage between test runs.
* Each daily run should be a separate issue in Github https://github.com/dxos/teamwork/issues with fist two lines being date and version of Teamwork tested.

### Kube/Console:
- [x] Open Your browser and go to https://apollo1.kube.moon.dxos.network/ on both machines 
- [x] Click on Apps on both machines
- [x] Click on Teamwork@Alpha on both machines

### Basic functionality:
- [x] Create new identity on Machine A
- [x] Download seed phrase on Machine A
- [x] Create new party on Machine A
- [x] Invite Machine B from Machine A
- [x] Join the party from Machine B

### Planner:
- [x] Create planner board from Machine A
- [x] Verify that board is showing up on Machine B
- [x] Create new column in planner board on Machine B
- [x] Rename newly created column on Machine B
- [x] Verify that two above changes are visible on Machine A
- [x] Create 3 new items on Machine A
- [x] Move item 1 to Doing on Machine A
- [x] Move item 1 to Done on Machine A
- [x] Verify that 3 above changes are visible on Machine B
- [x] Move item 2 to Done on Machine B
- [x] Archive item 1
- [x] Unarchive item 1
- [x] Add red tag to item 2
- [x] Remove red tag from item 2

### Messenger:
- [x] Create chat room
- [x] Post from Machine A
- [x] Post from Machine B
- [x] Download chat logs as markdown

### Text editor:
- [x] Create text document
- [x] Edit text document from Machine A
- [x] Edit text document from Machine B
- [x] Use text chat inside text document from Machine A
- [x] Use text chat inside text document from Machine B
- [x] Download text document as markdown
- [x] Upload text document to IPFS
- [x] Add image (IPFS?)
- [x] Embedd existing planner board inside text document
- [x] Embedd new planner board inside document
- [x] Embedd new task list inside document 
- [x] Embedd messenger inside document

### Bots:
- [ ] Invite storage bot to party (TODO(Chris): Add longer instructions)
- [ ] Verify that storgage bot works (TODO(Chris): Add longer instructions)

### Parties operations:
- [x] Rename party
- [x] Archive party
- [x] Unarchive party
- [ ] Download party to localhost
- [ ] Restore party form localhost
- [x] Rename documents inside party
- [ ] Save party to IPFS
- [ ] Load party from IPFS
