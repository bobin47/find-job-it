import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'hepler/config';
import { extname } from 'path';
import { FilterCompanyDto } from './dto/filter-company.dto';
import { Role } from 'src/auth/decorator/role.decorator';
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Get()
  @Public()
  findAll(@Query() query:FilterCompanyDto){
    console.log(query)
    return this.companyService.findAll(query)
  }

  @Public()
  @Get("/:id")
  findOne(
    @Param('id') id:number
  ){
    return this.companyService.findOne(id)
  }

  @Post()
  @Role("Admin")
  @UseInterceptors(
    FileInterceptor('company', {
      storage: storageConfig('company'),
      fileFilter: (req, file, callback) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg', '.pdf'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
          callback(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError =
              'File size is too large. Accepted file size is less than 5 MB';
            callback(null, false);
          } else {
            callback(null, true);
          }
        }
      },
    }),
  )
  create(
    @Body() createCompany: CreateCompanyDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.companyService.create({
      ...createCompany,
      logo: file.destination.split('upload/')[1] + '/' + file.filename,
    });
  }

  @Put('/:id')
  @Role("Admin")
  @UseInterceptors(
    FileInterceptor('company', {
      storage: storageConfig('company'),
      fileFilter: (req, file, callback) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg', '.pdf'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
          callback(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError =
              'File size is too large. Accepted file size is less than 5 MB';
            callback(null, false);
          } else {
            callback(null, true);
          }
        }
      },
    }),
  )
  update(
    @Param("id") id:number,
    @Body() createCompany: CreateCompanyDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.companyService.update(id,{
      ...createCompany,
      logo: file.destination.split('upload/')[1] + '/' + file.filename,
    });
  }

  @Delete('/:id')
  @Role("Admin")
  delete(
    @Param("id") id:number
  ){
    return this.companyService.delete(id)
  }
}
