import axios from 'axios';
import { exec } from 'child_process';
import { configURL } from '../../config'; 

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

export async function getUnusedActivationCode(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const podName = process.env.MYSQL_POD;
        const dbName = process.env.MYSQL_DATABASE;
        const dbUser = process.env.MYSQL_USER;
        const dbPassword = process.env.MYSQL_PASSWORD;
        const namespace = process.env.MYSQL_NAMESPACE;

        const getActivationCodeSQL = 'SELECT kod FROM KodAktywacyjny WHERE czyWykorzystany = 0 LIMIT 1';

        const sqlCommand = `mysql -u ${dbUser} -p${dbPassword} -e '${getActivationCodeSQL}' ${dbName}`;
        const kubectlCommand = `kubectl exec -n ${namespace} ${podName} -- ${sqlCommand}`;

        exec(kubectlCommand, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error fetching activation code: ${stderr}`);
            return reject(error);
          }

          const activationCode = stdout.trim().split('\n')[1]; 
          resolve(activationCode);
        });
    });
}

export async function getNotActiveFarm(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const podName = process.env.MYSQL_POD;
      const dbName = process.env.MYSQL_DATABASE;
      const dbUser = process.env.MYSQL_USER;
      const dbPassword = process.env.MYSQL_PASSWORD;
      const namespace = process.env.MYSQL_NAMESPACE;

      const getFarmNameSQL = 'SELECT nazwaGospodarstwa FROM Gospodarstwo WHERE czyAktywne = 0 LIMIT 1';

      const sqlCommand = `mysql -u ${dbUser} -p${dbPassword} -e '${getFarmNameSQL}' ${dbName}`;
      const kubectlCommand = `kubectl exec -n ${namespace} ${podName} -- ${sqlCommand}`;
      exec(kubectlCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error fetching activation code: ${stderr}`);
          return reject(error);
        }

        const farmName = stdout.trim().split('\n')[1]; 
        resolve(farmName);
      });
    })
}

export async function getUsedCode(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const podName = process.env.MYSQL_POD;
    const dbName = process.env.MYSQL_DATABASE;
    const dbUser = process.env.MYSQL_USER;
    const dbPassword = process.env.MYSQL_PASSWORD;
    const namespace = process.env.MYSQL_NAMESPACE;

    const getActivationCodeSQL = 'SELECT kod FROM KodAktywacyjny WHERE czyWykorzystany = 1 LIMIT 1';

    const sqlCommand = `mysql -u ${dbUser} -p${dbPassword} -e '${getActivationCodeSQL}' ${dbName}`;
    const kubectlCommand = `kubectl exec -n ${namespace} ${podName} -- ${sqlCommand}`;
    exec(kubectlCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error fetching activation code: ${stderr}`);
        return reject(error);
      }

      const activationCode = stdout.trim().split('\n')[1]; 
      resolve(activationCode);
    });
  })
}
function getDatePlusDays(days: number) {
    const today = new Date();
    today.setDate(today.getDate() + days);
    return today.toISOString().split('T')[0];
}
