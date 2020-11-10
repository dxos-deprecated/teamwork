### Instructions:
* You should be testing using 2 machines with 2 different browsers (Brave / Chrome / Firefox are initial targets).
* If that's no possible, use two different profiles of Chrome / Brave on a single machine.
* Reset browser local storage between test runs.
* Each daily run should be a separate issue in Github https://github.com/dxos/teamwork/issues with the form below filled out. This issue should
* Each person on the QA duty should attach at least one screen recording per week.

### Details:
- [ ] Date: _____
- [ ] Teamwork version: _____
- [ ] KUBE: _____
- [ ] Using: 1 machine / 2 machines
- [ ] Browser 1: _____
- [ ] Browser 2: _____
- [ ] Video recording: _____ / nope

### Setup:
- [ ] Reset both browsers storage

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
- [ ] Create another party from Machine A and verify Machine B is stated as 'connected'
- [ ] Redeem invitation from Machine B checking Offline
- [ ] Create kanban
- [ ] Create text document
- [ ] Create chat room
- [ ] Create task list

### Planner:
- [ ] Open planner board from Machine A
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
- [ ] Change red tag name
- [ ] Verify if name has changed in both: labels and filter list
- [ ] Remove red tag from item 2

### Messenger:
- [ ] Create chat room
- [ ] Post from Machine A
- [ ] Post from Machine B
- [ ] Download chat logs as markdown
- [ ] Join video chat from Machine A
- [ ] Verify that audio/video selection works 
- [ ] Join video chat from Machine B
- [ ] Verify that both video and audio work well on both machines
- [ ] Leave video chat on Machine A
- [ ] Leave video chat on Machine B
- [ ] Reference existing task list in messenger
- [ ] Reference existing text document in messenger
- [ ] Reference existing planner board in messenger

### Text editor:
- [ ] Create another text document
- [ ] Edit text document from Machine A
- [ ] Edit text document from Machine B
- [ ] Verify that presence indicators are moving accurately, without delay
- [ ] Verify that presence indicators are showing correct usernames 
- [ ] Verify that presence indicators are showing 
- [ ] Use text chat inside text document from Machine A
- [ ] Use text chat inside text document from Machine B
- [ ] Download text document as markdown
- [ ] Upload text document to IPFS
- [ ] Add image (IPFS?)
- [ ] Embed existing planner board inside text document
- [ ] Verify that planner board works and isn't too tall
- [ ] Embed new planner board inside document
- [ ] Embed existing task list inside document
- [ ] Verify that task list works and isn't too tall
- [ ] Embed new task list inside document 
- [ ] Embed existing messenger inside document
- [ ] Verify that messenger works and isn't too tall
- [ ] Embed new messenger inside document
- [ ] Switch between this text document and the previously created one using sidebar documents list, confirm that switching works

### Bots:
- [ ] Invite storage bot to party
- [ ] Verify that storage bot works

### Parties operations:
- [ ] Rename party
- [ ] Archive party
- [ ] Verify that You can see archived parties
- [ ] Unarchive party
- [ ] Verify that You can see the unarchived party
- [ ] Download party to localhost
- [ ] Restore party form localhost
- [ ] Rename documents inside party
- [ ] Save party to IPFS
- [ ] Load party from IPFS
- [ ] Reset storage from home screen
