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
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Status } from './entities/status.enum';
import { DataMigrationService } from './data-migration.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly dataMigrationService: DataMigrationService,
  ) {}

  // Temporary endpoint to run data migration
  @Post('migrate-data')
  async migrateData() {
    await this.dataMigrationService.cleanAppointmentsData();
    return { message: 'Data migration completed successfully' };
  }

  @Roles(UserRole.client)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  createAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Req() request,
  ) {
    const user = request.user;
    return this.appointmentsService.createAppointment(
      createAppointmentDto,
      user,
    );
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
  @Get('my-appointments')
  findMyAppointments(@Req() request) {
    const user = request.user;
    return this.appointmentsService.findUserAppointments(1, 100, {}, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('booked-hours/:providerId')
  getBookedHours(
    @Param('providerId') providerId: string,
    @Query('date') date: string,
  ) {
    return this.appointmentsService.getBookedHours(providerId, date);
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
    @Body() appointmentDto: UpdateAppointmentDto,
    @Req() request,
  ) {
    const status = appointmentDto.Status;
    console.log(status);
    const user = request.user;
    // return this.appointmentsService.update(id, status, user);
    return this.appointmentsService.update(
      id,
      status as unknown as Status,
      user,
    );
  }
}