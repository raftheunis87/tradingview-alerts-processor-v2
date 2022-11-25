import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  APIResponseWithTime,
  InverseClient,
  LinearClient,
  PerpPosition,
} from 'bybit-api';
import { AccountsService } from 'src/accounts/accounts.service';
import Decimal from 'decimal.js';

@Injectable()
export class BybitService {
  private readonly logger = new Logger(BybitService.name);

  private linearClients: Map<string, LinearClient> = new Map();
  private inverseClients: Map<string, InverseClient> = new Map();

  constructor(private accountsService: AccountsService) {}

  async enterLongPosition(
    stub: string,
    symbol: string,
    quantity: number,
  ): Promise<void> {
    const client = await this.getLinearClient(stub);
    const inverseClient = await this.getInverseClient(stub);

    const askPrice = await this.getAskPriceForSymbol(inverseClient, symbol);
    const qtyStep = await this.getQtyStepForSymbol(inverseClient, symbol);
    const qty = this.roundStep(quantity / askPrice, qtyStep);

    await this.placeActiveOrder('Buy', client, symbol, qty, false);
    return;
  }

  async closeLongPosition(stub: string, symbol: string): Promise<void> {
    const client = await this.getLinearClient(stub);
    const positionResult = await this.getPosition(client, symbol);

    const activePosition = positionResult.result.find(
      (pos) => pos.symbol === symbol,
    );

    if (
      !activePosition ||
      activePosition.side !== 'Buy' ||
      activePosition.size == 0
    ) {
      const errorMessage = `No position to close for symbol '${symbol}'.`;
      this.logger.error(errorMessage);
      throw new NotFoundException(errorMessage);
    }

    await this.placeActiveOrder(
      'Sell',
      client,
      symbol,
      activePosition.size,
      true,
    );
    return;
  }

  private async getLinearClient(stub: string): Promise<LinearClient> {
    const foundInCache = this.linearClients.get(stub);

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
      this.linearClients.set(stub, linearClient);
      return linearClient;
    }

    const errorMessage = `No account information found for stub '${stub}'`;
    this.logger.error(errorMessage);
    throw new NotFoundException(errorMessage);
  }

  private async getInverseClient(stub: string): Promise<InverseClient> {
    const foundInCache = this.inverseClients.get(stub);

    if (foundInCache) {
      return foundInCache;
    }

    const foundInDatabase = await this.accountsService.findOne(stub);

    if (foundInDatabase) {
      let inverseClient = new InverseClient({
        key: foundInDatabase.apiKey,
        secret: foundInDatabase.secret,
        testnet: false,
      });
      this.inverseClients.set(stub, inverseClient);
      return inverseClient;
    }

    const errorMessage = `No account information found for stub '${stub}'`;
    this.logger.error(errorMessage);
    throw new NotFoundException(errorMessage);
  }

  private async getAskPriceForSymbol(
    inverseClient: InverseClient,
    symbol: string,
  ): Promise<number> {
    try {
      const tickers = await inverseClient.getTickers({ symbol: symbol });
      if (tickers.ret_msg !== 'OK') {
        throw new InternalServerErrorException();
      }
      return parseFloat(tickers.result[0].ask_price);
    } catch (error) {
      this.logger.error(
        `Error fetching tickers to get ask price of symbol "${symbol}".`,
      );
      throw new InternalServerErrorException();
    }
  }

  private async getQtyStepForSymbol(
    inverseClient: InverseClient,
    symbol: string,
  ): Promise<number> {
    try {
      const symbols = await inverseClient.getSymbols();
      if (symbols.ret_msg !== 'OK') {
        throw new InternalServerErrorException();
      }
      const found = symbols.result.find((filter) => filter.name == symbol);
      return found.lot_size_filter.qty_step;
    } catch (error) {
      this.logger.error(
        `Error fetching symbols to get qty step size of symbol "${symbol}".`,
      );
      throw new InternalServerErrorException();
    }
  }

  private async getPosition(
    linearClient: LinearClient,
    symbol: string,
  ): Promise<APIResponseWithTime<PerpPosition[]>> {
    try {
      const position = await linearClient.getPosition({
        symbol: symbol,
      });
      if (position.ret_msg !== 'OK') {
        throw new InternalServerErrorException();
      }
      return position;
    } catch (error) {
      this.logger.error(`Error fetching open position for symbol '${symbol}'.`);
      throw new InternalServerErrorException();
    }
  }

  private async placeActiveOrder(
    orderSide: string,
    linearClient: LinearClient,
    symbol: string,
    qty: number,
    reduceOnly: boolean,
  ): Promise<void> {
    try {
      const orderResult = await linearClient.placeActiveOrder({
        side: orderSide == 'Buy' ? 'Buy' : 'Sell',
        symbol,
        order_type: 'Market',
        qty,
        time_in_force: 'GoodTillCancel',
        reduce_only: reduceOnly,
        close_on_trigger: false,
      });
      if (orderResult.ret_msg !== 'OK') {
        throw new InternalServerErrorException();
      }
      this.logger.verbose(
        `${orderSide.toUpperCase()} order of ${qty} contract(s) for symbol '${symbol}' processed successfully.`,
      );
      return;
    } catch (error) {
      this.logger.error(
        `Creating ${orderSide.toLowerCase()} order of ${qty} contracts for symbol '${symbol}' failed.`,
      );
      throw new InternalServerErrorException();
    }
  }

  private roundStep(quantity: number, stepSize: number): number {
    const numStepSize = +stepSize;

    const precision = this.countDecimals(stepSize + 1);
    const numLength = this.countDecimals(quantity + 1);
    const roundedStepD = new Decimal(quantity);

    if (precision !== numLength) {
      const intermediate = ((quantity / numStepSize) | 0) * numStepSize;
      const roundedStepD = new Decimal(intermediate);
      return +roundedStepD.toDecimalPlaces(precision).toString();
    }

    return +roundedStepD.toDecimalPlaces(precision).toString();
  }

  private countDecimals(value: number): number {
    if (Math.floor(value) !== value) {
      const decimalSplit = value.toString().split('.');

      if (!decimalSplit[1]) return 0;
      return decimalSplit[1].length || 0;
    }
    return 0;
  }
}
