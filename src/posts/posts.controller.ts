import { PostsService } from './posts.service';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePostDto } from './dto/ create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'hepler/config';
import { AuthGuard } from 'src/auth/auth.guard';
import { extname } from 'path';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: storageConfig('post'),
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
    @Req() req: any,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.postsService.create(req['user_date'].id, {
      ...createPostDto,
      thumbnail: file.destination + '/' + file.originalname,
    });
  }
}
