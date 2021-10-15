import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CryptoService } from './services/crypto.service';
import { SengridService } from "./services/sendgrid.service";

import { Permission } from "../entities/users/permission.entity";
import { Role } from "../entities/users/role.entity";
import { Language } from "../entities/users/language.entity";
import { User } from "../entities/users/user.entity";
import { PermissionDatabaseDefault } from "./database/permission.default";
import { RolDatabaseDefault } from "./database/role.default";
import { LanguageDatabaseDefault } from "./database/language.default";
import { TokenService } from "./services/token.service";
import { ScrapingModule } from "../modules/scraping/scraping.module";
import { LinktreeService } from "./services/scraping/linktree/linktree.service";
import { LnkbioService } from "./services/scraping/lnkbio/lnkbio.service";
import { HttpModule } from "@nestjs/axios";
import { GenericService } from "./services/scraping/generic/generic.service";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Permission, Role, Language], 'users'),
    ScrapingModule,
    HttpModule
  ],
  providers: [
    CryptoService,
    SengridService,
    TokenService,
    PermissionDatabaseDefault,
    RolDatabaseDefault,
    LanguageDatabaseDefault,
    LnkbioService,
    LinktreeService,
    GenericService
  ],
  exports: [
    TokenService,
    CryptoService,
    SengridService,
    LinktreeService,
    LnkbioService,
    GenericService
  ]
})
export class CommonModule { }
