import {test} from '@playwright/test'
import signInTests from './signIn.spec'
import signUpFarmTests from './signUpFarm.spec'
import signUpUserTests from './signUpUser.spec'

test.describe(signInTests)
test.describe(signUpFarmTests)
test.describe(signUpUserTests)