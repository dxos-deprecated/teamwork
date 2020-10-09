const headless = !!process.env.CI

class User {

    name = ''
    browser = null
    context = null
    page = null

    constructor(_name) {
        this.name = _name
    }

    async launchBrowser(_browser, _startUrl) {
        this.browser = await _browser.launch({headless})
        this.context = await this.browser.newContext()
        this.page = await this.context.newPage()
        await this.page.goto(_startUrl, {waitUntil: 'load'})
    }

    async closeBrowser() {
        await this.browser.close()
    }

    async createWallet() {
        const walletButtonSelector = textButtonSelector('Create Wallet')
        await this.page.waitForSelector(walletButtonSelector)
        await this.page.click(walletButtonSelector)
        await this.page.waitForSelector('input')
        await this.page.fill('input', this.name)
        const nextButtonSelector = textButtonSelector('Next')
        await this.page.click(nextButtonSelector)
        await this.page.waitForSelector(nextButtonSelector)
        await this.page.click(nextButtonSelector)
        const finishButtonSelector = textButtonSelector('Finish')
        await this.page.waitForSelector(finishButtonSelector)
        await this.page.click(finishButtonSelector)
    }

    async createParty() {
        const newPartyButtonSelector = `(//button[@name='new-party'])[1]`
        await this.page.waitForSelector(newPartyButtonSelector)
        await this.page.click(newPartyButtonSelector)
    }

    async inviteUnknownUserToParty() {
        const addMemberButtonSelector = `(//div[@title='Share'])[1]`
        await this.page.waitForSelector(addMemberButtonSelector)
        await this.page.click(addMemberButtonSelector)
        const inviteUserButtonSelector = textButtonSelector('Invite User')
        await this.page.waitForSelector(inviteUserButtonSelector)
        await this.page.click(inviteUserButtonSelector)
    }

    async getShareLink() {
        const linkRegex = /(https?:\/\/)/g
        let link = null

        await this.page.waitForEvent('console', message => {
            if(message.text().match(linkRegex)){
                link = message.text()
                return true
            }
            return false
        })

        return link
    }

    async getPasscode() {
        const passcodeSelector = `//span[contains(@class,'passcode')]`
        await this.page.waitForSelector(passcodeSelector)
        return await this.page.$eval(passcodeSelector, passcode => passcode.innerHTML)
    }

    async fillPasscode(passcode) {
        await this.page.waitForSelector('input')
        await this.page.fill('input', passcode)
    }

    async isUserInParty(username) {
        const avatarGroupSelector = `//div[contains(@class,'MuiAvatarGroup-root')]`
        // await this.page.waitForSelector(avatarGroupSelector)
        const userAvatarSelector = `${avatarGroupSelector}/*[@title='${username}']`
        await this.page.waitForSelector(userAvatarSelector, {timeout: 1e4})
        return await this.page.$eval(userAvatarSelector, avatar => !!avatar)
    }
}

const textButtonSelector = (text) => `//span[contains(@class,'MuiButton-label') and contains(text(),'${text}')]`

module.exports = { User }