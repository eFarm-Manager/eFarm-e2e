import axios from 'axios';
import { exec } from 'child_process';
import { config } from 'dotenv';
import { configURL } from '../../config'; 
import { v4 as uuidv4 } from 'uuid';

export async function createUserFarm(activationCode: string) {
  const newUser = {
    username: `testUser_${Date.now()}`, 
    password: 'testPass',
    activationCode: activationCode,
    firstName: 'testFirstName',
    lastName: 'testLastName',
    email: 'testEmail@gmail.com',
    phoneNumber: '',
    farmName: `testFarm_${Date.now()}`,
  };

  await axios.post(`${configURL.baseURL}/api/auth/signupfarm`, {
    username: newUser.username,
    password: newUser.password,
    activationCode: newUser.activationCode,
    firstName:newUser.firstName,
    lastName:newUser.lastName,
    email:newUser.email,
    phoneNumber:newUser.phoneNumber,
    farmName:newUser.farmName
  });

  console.log(`User ${newUser.username} created successfully.`);
  return newUser;
}

export async function createUnusedActivationCode(code: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        config();
        const podName = process.env.MYSQL_POD;
        const dbName = process.env.MYSQL_DATABASE;
        const dbUser = process.env.MYSQL_USER;
        const dbPassword = process.env.MYSQL_PASSWORD;
        const date_plus28 = getDatePlusDays(28);


        const getActivationCodeSQL = `insert into KodAktywacyjny (kod, dataWaznosci, czyWykorzystany) values ('${code}', '${date_plus28}', 0)`;

        const sqlCommand = `mysql -u ${dbUser} -p${dbPassword} -e "${getActivationCodeSQL}" ${dbName}`;
        const kubectlCommand = `kubectl exec ${podName} -- ${sqlCommand}`;

        exec(kubectlCommand, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error fetching activation code: ${stderr}`);
            return reject(error);
          }

          console.log(`Fetched activation code: ${code}`);
          resolve(code);
        });
    });
  }


function getDatePlusDays(days: number) {
    const today = new Date();
    today.setDate(today.getDate() + days);
    return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}

export async function createUniqueActivationCode() {
    const uniqueCode = uuidv4(); 
    return uniqueCode;
}