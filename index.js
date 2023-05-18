import gInput from './common/gInput.vue'
import gError from './common/gError.vue'
import clipboardButton from './common/clipboardButton.vue'
import formSubtypesUsers from './common/formSubtypes/users.vue'
import formSubtypesMyOrgs from './common/formSubtypes/myOrgs.vue'
import edgeAuth from './edgeAuth.vue'
import edgeMyAccount from './edgeMyAccount.vue'
import edgeMyOrganizations from './edgeMyOrganizations.vue'
import edgeMyProfile from './edgeMyProfile.vue'
import edgeOrganizationSettings from './edgeOrganizationSettings.vue'
import edgeOrganizationMembers from './edgeOrganizationMembers.vue'
import helper from './common/helper.vue'
import loggingIn from './common/loggingIn.vue'
import edgeOrgSwitcher from './edgeOrgSwitcher.vue'

export default {
  install: (app) => {
    app.component('GInput', gInput)
    app.component('GError', gError)
    app.component('ClipboardButton', clipboardButton)
    app.component('FormSubtypesUsers', formSubtypesUsers)
    app.component('FormSubtypesMyOrgs', formSubtypesMyOrgs)
    app.component('EdgeAuth', edgeAuth)
    app.component('EdgeMyAccount', edgeMyAccount)
    app.component('EdgeMyOrganizations', edgeMyOrganizations)
    app.component('EdgeMyProfile', edgeMyProfile)
    app.component('EdgeOrganizationSettings', edgeOrganizationSettings)
    app.component('EdgeOrganizationMembers', edgeOrganizationMembers)
    app.component('Helper', helper)
    app.component('LoggingIn', loggingIn)
    app.component('EdgeOrgSwitcher', edgeOrgSwitcher)
  },
}
