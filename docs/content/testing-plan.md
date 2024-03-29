### Instructions:
* Open a new issue and use the format of 'Manual test run' + app + version in the title.
* Use the label of 'QA' for the new issue.
* Update https://github.com/dxos/gravity/blob/main/docs/content/qa/index.md with a link to the new issue.
* If any bugs are found, open new issues if they don't already exist. Add links into the test issue. Add a comment on the issue of the format "Feature: Name of feature : BROKEN"
* Update https://github.com/dxos/gravity/blob/main/docs/content/qa/index.md with a list of broken features with links to the issues.
* When a manual test is added to automation via playwright, remove it from the template.
* Test using 2 machines with 2 different browsers (Brave / Chrome / Firefox are initial targets).
* If that's not possible, use two different profiles of Chrome / Brave on a single machine.
* Reset browser local storage between test runs.
* Each daily run should be a comment in the testing tracking issue with the form below filled out.
* Each person on the QA duty should attach at least one screen recording per week.

### Status:
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
- [ ] Open https://apollo1.kube.moon.dxos.network on both machines 
- [ ] Click on Apps on both machines
- [ ] Click on `teamwork@alpha` on both machines

### Basic functionality:
- [PLAYWRIGHT] Create new identity on Machine A
- [PLAYWRIGHT] Download seed phrase on Machine A
- [PLAYWRIGHT] Create new party on Machine A
- [PLAYWRIGHT] Create new identity on Machine B
- [PLAYWRIGHT] Invite Machine B from Machine A
- [PLAYWRIGHT] Join the party from Machine B
- [PLAYWRIGHT] Create another party from Machine A and verify Machine B is stated as 'contact'
- [PLAYWRIGHT] Redeem invitation from Machine B checking Offline
- [PLAYWRIGHT] Create kanban
- [PLAYWRIGHT] Create text document
- [PLAYWRIGHT] Create chat room
- [PLAYWRIGHT] Create task list
- [PLAYWRIGHT] Check that device invitation works
- [PLAYWRIGHT] Check that restore wallet works

### Planner:
- [PLAYWRIGHT] Open planner board from Machine A
- [PLAYWRIGHT] Verify that board is showing up on Machine B
- [PLAYWRIGHT] Create new column in planner board on Machine B
- [PLAYWRIGHT] Rename newly created column on Machine B
- [PLAYWRIGHT] Verify that two above changes are visible on Machine A
- [PLAYWRIGHT] Create 3 new items on Machine A
- [ ] Move item 1 to Doing on Machine A
- [ ] Move item 1 to Done on Machine A
- [ ] Verify that 3 above changes are visible on Machine B
- [ ] Move item 2 to Done on Machine B
- [PLAYWRIGHT] Archive item 1
- [PLAYWRIGHT] Unarchive item 1
- [ ] Add red tag to item 2
- [ ] Change red tag name
- [ ] Verify if name has changed in both: labels and filter list
- [ ] Remove red tag from item 2

### Messenger:
- [PLAYWRIGHT] Open existing chat room from Machine A
- [PLAYWRIGHT] Post from Machine A
- [PLAYWRIGHT] Post from Machine B
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
- [PLAYWRIGHT] Create another text document
- [PLAYWRIGHT] Edit text document from Machine A
- [PLAYWRIGHT] Edit text document from Machine B
- [ ] Verify that presence indicators are moving accurately, without delay
- [ ] Verify that presence indicators are showing correct usernames 
- [ ] Verify that presence indicators are showing 
- [ ] Use text chat inside text document from Machine A
- [ ] Use text chat inside text document from Machine B
- [ ] Download text document as markdown
- [ ] Upload text document to IPFS
- [ ] Add image (IPFS?)
- [PLAYWRIGHT] Embed existing planner board inside text document
- [ ] Verify that planner board works and isn't too tall
- [ ] Embed new planner board inside document
- [ ] Verify that You can scroll planner board in both directions and that it isn't too tall
- [PLAYWRIGHT] Embed existing task list inside document
- [ ] Verify that task list works and isn't too tall
- [ ] Embed new task list inside document 
- [PLAYWRIGHT] Embed existing messenger inside document
- [ ] Verify that messenger works and isn't too tall
- [ ] Embed new messenger inside document
- [ ] Switch between this text document and the previously created one using sidebar documents list, confirm that switching works

### Bots:
- [ ] Invite storage bot to party
- [ ] Verify that storage bot works

### Parties operations:
- [PLAYWRIGHT] Rename party
- [PLAYWRIGHT] Deactivate party
- [PLAYWRIGHT] Verify that You can see deactivated parties
- [PLAYWRIGHT] Activate party
- [PLAYWRIGHT] Verify that You can see the activated party
- [ ] Download party to localhost
- [ ] Restore party form localhost
- [ ] Rename documents inside party
- [ ] Save party to IPFS
- [ ] Load party from IPFS
- [ ] Save party to file
- [ ] Load party from file
- [ ] Reset storage from home screen
