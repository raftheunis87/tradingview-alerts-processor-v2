import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Account } from './account.entity';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  findAll(): Promise<Account[]> {
    return this.accountsService.findAll();
  }

  @Get(':stub')
  findOne(@Param('stub') stub: string): Promise<Account> {
    return this.accountsService.findOne(stub);
  }
}
