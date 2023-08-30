import { PostsService } from './posts.service';
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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePostDto } from './dto/ create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'hepler/config';
import { AuthGuard } from 'src/auth/auth.guard';
import { extname } from 'path';
import { FilterPostDto } from './dto/filter-post';
import { UpdatePostDto } from './dto/update-post.dto';
import { Role } from 'src/auth/decorator/role.decorator';
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(AuthGuard)
  @Post()
  @Role('Admin', 'User')
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
      thumbnail: file.destination.split('upload/')[1] + '/' + file.filename,
    });
  }

  @Get()
  @Public()
  findAll(@Query() filterPostDto: FilterPostDto) {
    return this.postsService.findAll(filterPostDto);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Put(':id')
  @Role('Admin', 'User')
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
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }

    if (file) {
      updatePostDto.thumbnail =
        file.destination.split('upload/')[1] + '/' + file.filename;
    }

    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @Role('Admin', 'User')
  delete(@Param('id') id: string) {
    return this.postsService.delete(+id);
  }

  @Role('Admin', 'User')
  @Get('user/:email')
  getPostWithUserId(@Param() email: any) {
    return this.postsService.getPostWithIdUser(email);
  }
}
