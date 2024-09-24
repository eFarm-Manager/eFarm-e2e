import { exec } from 'child_process';
import { config } from 'dotenv';

export async function cleanupFarm_User_Code(username: string, activationCode: string,farmName: string) {
    return new Promise<void>((resolve, reject) => {
        config();
        const podName = process.env.MYSQL_POD; 
        const dbName = process.env.MYSQL_DATABASE;
        const dbUser = process.env.MYSQL_USER;
        const dbPassword = process.env.MYSQL_PASSWORD;      
        const deleteUserSQL = `DELETE FROM Uzytkownik WHERE login = '${username}'`;
        const deleteFarmSQL = `DELETE FROM Gospodarstwo WHERE nazwaGospodarstwa = '${farmName}'`;
        const unmarkCodeSQL = `DELETE FROM KodAktywacyjny WHERE kod = '${activationCode}'`;        
        const sqlCommand = `mysql -u ${dbUser} -p${dbPassword} -e "${deleteUserSQL}; ${deleteFarmSQL}; ${unmarkCodeSQL}" ${dbName}`;        
        const kubectlCommand = `kubectl exec ${podName} -- ${sqlCommand}`;        
        exec(kubectlCommand, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing kubectl exec: ${stderr}`);
            return reject(error);
          }
          console.log(`Cleanup successful: ${stdout}`);
          resolve();
        });
    });
}
