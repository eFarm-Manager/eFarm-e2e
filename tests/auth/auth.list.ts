import {test} from '@playwright/test'
import signInTests from './signIn.spec'
import signUpFarmTests from './signUpFarm.spec'
import changePasswordTests from './changePassword.spec'

test.describe(signInTests)
test.describe(signUpFarmTests)
test.describe(changePasswordTests)