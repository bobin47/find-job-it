import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'hepler/config';
import { extname } from 'path';
import { ResumeService } from './resume.service';
import { ResumeDto } from './dto/resumer.dto';
import { Role } from 'src/auth/decorator/role.decorator';

@Controller('resume')
export class ResumeController {
  constructor(private resumeService: ResumeService) {}

  @Post('apply-cv')
  @Role('User','Admin')
  @UseInterceptors(
    FileInterceptor('linkCv', {
      storage: storageConfig('resume'),
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
  applyCv(
    @Req() req: any,
    @Body() createResumeDto: ResumeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }


    return this.resumeService.uploadCV({
      ...createResumeDto,
      linkCv: file.destination.split('upload/')[1] + '/' + file.filename,
    });
  }

}
