import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Password {
  // Static methods are methods that can access without creating an instance of a class
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, supplyPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(supplyPassword, salt, 64)) as Buffer;
    // console.log(buf.toString('hex'), { hashedPassword });

    return buf.toString('hex') === hashedPassword;
  }
}
