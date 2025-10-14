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
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { DataMigrationService } from './data-migration.service';

@UseGuards(JwtAuthGuard)
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

  // @Roles()
  // @UseGuards(JwtAuthGuard)
  @Post()
  createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
    // Respuesta temporal para evitar 404 mientras se implementa lógica
    return { ok: true, message: 'Appointment creation is under construction' };
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
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(+id, updateAppointmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(+id);
  }
}