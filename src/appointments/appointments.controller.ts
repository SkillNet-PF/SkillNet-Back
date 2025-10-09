import { Controller, Get, Post, Body, Param, Delete, Query, Req, UseGuards, Put } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  // @Roles()
  // @UseGuards(JwtAuthGuard)
  @Post()
  createAppointment(@Body() createAppointmentDto: CreateAppointmentDto, @Req() request) {
    const user = request.user
    return this.appointmentsService.createAppointment(createAppointmentDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findUserAppointmens(@Req() request, @Query('page') page:string, @Query('limit') limit:string) {
    const user = request.user
    if(page && limit){
     this.appointmentsService.findUserAppointments(Number(page), Number(limit), user);
    }
    return this.appointmentsService.findUserAppointments(1, 5, user)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.update(+id, updateAppointmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(+id);
  }
}
