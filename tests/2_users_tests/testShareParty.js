const chai = require('chai')
const mocha = require('mocha')

const {firefox} = require('playwright')

const { User } = require('../User.js')

const {expect} = chai
const {beforeEach, afterEach, describe, it} = mocha

const timeout = 1e5
const startUrl = 'localhost:8080'

describe('Share party', () => {

    let userA = null
    let userB = null

    beforeEach(() => {
        userA = new User('UserA')
        userB = new User('UserB')
    })

    afterEach(() => {
        userA.closeBrowser()
        userB.closeBrowser()
    })
    
    it('Checks if UserB has UserA icon in his party after accepting invitation by link', async () => {

        await userA.launchBrowser(firefox,startUrl)
        await userA.createWallet()
        await userA.createParty()
        await userA.inviteUnknownUserToParty()

        await userB.launchBrowser(firefox, await userA.getShareLink())
        await userB.createWallet()
        await userB.fillPasscode(await userA.getPasscode())

        // ALSO CHECK IF NOT THROWING ANYTHING
        // expect(userB.isUserInParty("haha")).to.not.throw()
        expect(await userB.isUserInParty(userA.name)).to.be.true
    }).timeout(timeout)
})