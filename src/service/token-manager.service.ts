import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class TokenManagerService {
  private dbName = 'tokenDB';
  private storeName = 'tokens';
  private secretKey = 'super_secret_key';
  private db!: IDBPDatabase;

  constructor() {
    this.initDB();
  }

  private async initDB(): Promise<void> {
    this.db = await openDB(this.dbName, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('tokens')) {
          db.createObjectStore('tokens');
        }
      },
    });
  }

  private encrypt(token: string): string {
    return CryptoJS.AES.encrypt(token, this.secretKey).toString();
  }

  private decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  async saveToken(service: string, token: string): Promise<void> {
    const encryptedToken = this.encrypt(token);
    await this.db.put(this.storeName, encryptedToken, service);
  }

  async getToken(service: string): Promise<string | null> {
    const encryptedToken = await this.db.get(this.storeName, service);
    return encryptedToken ? this.decrypt(encryptedToken) : null;
  }

  async deleteToken(service: string): Promise<void> {
    await this.db.delete(this.storeName, service);
  }

  async clearAllTokens(): Promise<void> {
    await this.db.clear(this.storeName);
  }
}
