import { Roles } from '@common/decorators/roles.decorator';
import { HttpAuth } from '@common/decorators/session.decorator';
import { JwtGuard } from '@common/guards/jwt.guard';
import { Controller, Post, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import axios from 'axios';

@Controller('/api/tool/image-detection')
export class ImageDetectionController {

  @Post("detect")
  @UseGuards(JwtGuard)
  async detect(@Body('image') base64: string) {
    if (!base64) {
      throw new HttpException('Missing base64 image data', HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await axios.post('http://localhost:8000/image-detection/detect', {
        image: base64,
      });

      // Return the detection result from Python service
      return response.data;
    } catch (err) {
      console.error('Error calling Python server:', err.message);

      throw new HttpException(
        'Failed to process image detection',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('train')
  @UseGuards(JwtGuard)
  @Roles("ADMIN")
  async train(@Body() body: any, @HttpAuth() user: AuthUser) {
    const { image, detections } = body;

    if (!image || !detections) {
      throw new HttpException(
        'Missing required fields: image or detections',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const response = await axios.post('http://localhost:8000/image-detection/train', {
        image,
        detections,
        created_by: user.id,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      return response.data;

    } catch (err) {
      console.error('❌ Error triggering training:', err.message);
      throw new HttpException(
        'Failed to start training: ' + err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
