import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LinearClient } from 'bybit-api';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class BybitService {
  private readonly logger = new Logger(BybitService.name);
  private clients: Map<string, LinearClient> = new Map();

  constructor(private accountsService: AccountsService) {}

  async getWalletBalance(stub: string) {
    const client = await this.getClient(stub);
    const result = await client.getWalletBalance();
    console.log(result);
  }

  private async getClient(stub: string): Promise<LinearClient> {
    const foundInCache = this.clients.get(stub);

    if (foundInCache) {
      return foundInCache;
    }

    const foundInDatabase = await this.accountsService.findOne(stub);

    if (foundInDatabase) {
      let linearClient = new LinearClient({
        key: foundInDatabase.apiKey,
        secret: foundInDatabase.secret,
        testnet: false,
      });
      this.clients.set(stub, linearClient);
      return linearClient;
    }

    const errorMessage = `No account information found for stub '${stub}'`;
    this.logger.error(errorMessage);
    throw new NotFoundException(errorMessage);
  }
}
