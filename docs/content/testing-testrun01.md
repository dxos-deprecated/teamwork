### Setup:
* You should be testing using 2 machines with 2 different browsers ( Brave / Chrome / Firefox are initial targets ).
* If that's no posssible, use two different profiles of Chrome / Brave on a single machine.
* Reset browser local storage between test runs.
* Each daily run should be a separate issue in Github https://github.com/dxos/teamwork/issues with fist two lines being date and version of Teamwork tested.

### Kube/Console:
- [ ] Open Your browser and go to https://apollo1.kube.moon.dxos.network/ on both machines 
- [ ] Click on Apps on both machines
- [ ] Click on Teamwork@Alpha on both machines

### Basic functionality:
- [ ] Create new identity on Machine A
- [ ] Download seed phrase on Machine A
- [ ] Create new party on Machine A
- [ ] Invite Machine B from Machine A
- [ ] Join the party from Machine B

### Planner:
- [ ] Create planner board from Machine A
- [ ] Verify that board is showing up on Machine B
- [ ] Create new column in planner board on Machine B
- [ ] Rename newly created column on Machine B
- [ ] Verify that two above changes are visible on Machine A
- [ ] Create 3 new items on Machine A
- [ ] Move item 1 to Doing on Machine A
- [ ] Move item 1 to Done on Machine A
- [ ] Verify that 3 above changes are visible on Machine B
- [ ] Move item 2 to Done on Machine B
- [ ] Archive item 1
- [ ] Unarchive item 1
- [ ] Add red tag to item 2
- [ ] Remove red tag from item 2

### Messenger:
- [ ] Create chat room
- [ ] Post from Machine A
- [ ] Post from Machine B
- [ ] Download chat logs as markdown
### Text editor:
- [ ] Create text document
- [ ] Edit text document from Machine A
- [ ] Edit text document from Machine B
- [ ] Use text chat inside text document from Machine A
- [ ] Use text chat inside text document from Machine B
- [ ] Download text document as markdown
- [ ] Upload text document to IPFS
- [ ] Add image (IPFS?)
- [ ] Embedd existing planner board inside text document
- [ ] Embedd new planner board inside document
- [ ] Embedd new task list inside document 
- [ ] Embedd messenger inside document

### Bots:
- [ ] Invite storage bot to party (TODO(Chris): Add longer instructions)
- [ ] Verify that storgage bot works (TODO(Chris): Add longer instructions)

### Parties operations:
- [ ] Rename party
- [ ] Archive party
- [ ] Unarchive party
- [ ] Download party to localhost
- [ ] Restore party form localhost
- [ ] Rename documents inside party
- [ ] Save party to IPFS
- [ ] Load party from IPFS
