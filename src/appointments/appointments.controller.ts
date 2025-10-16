import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { RolesGuard } from 'src/guards/roles.guard';


@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Roles(UserRole.client)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  createAppointment(@Body() createAppointmentDto: CreateAppointmentDto, @Req() request) {
    const user = request.user;
    return this.appointmentsService.createAppointment(createAppointmentDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findUserAppointmens(
    @Req() request,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('providerId') provider?: string,
  ) {
    const user = request.user;
    const filters = { status, category, provider };
    if (page && limit) {
      this.appointmentsService.findUserAppointments(
        Number(page),
        Number(limit),
        filters,
        user,
      );
    }
    return this.appointmentsService.findUserAppointments(1, 5, filters, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() request) {
    const user = request.user;
    return this.appointmentsService.findOne(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() status: string,
    @Req() request
  ) {
    const user = request.user;
    return this.appointmentsService.update(id, status, user);
  }

}
