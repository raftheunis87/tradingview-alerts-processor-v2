import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  create(createAccountDto: CreateAccountDto): Promise<Account> {
    const account = new Account();

    account.stub = createAccountDto.stub;
    account.exchange = createAccountDto.exchange;
    account.apiKey = createAccountDto.apiKey;
    account.secret = createAccountDto.secret;

    return this.accountsRepository.save(account);
  }

  async findAll(): Promise<Account[]> {
    return this.accountsRepository.find();
  }

  findOne(stub: string): Promise<Account> {
    return this.accountsRepository.findOneBy({ stub: stub });
  }
}
