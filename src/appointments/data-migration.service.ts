import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { Categories } from '../categories/entities/categories.entity';

@Injectable()
export class DataMigrationService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Categories)
    private categoryRepository: Repository<Categories>,
  ) {}

  async cleanAppointmentsData() {
    console.log('🧹 Starting data cleanup for appointments...');
    
    // Get all appointments without categories
    const appointmentsWithoutCategory = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.Category', 'category')
      .where('category.categoryId IS NULL')
      .getMany();

    console.log(`Found ${appointmentsWithoutCategory.length} appointments without categories`);

    if (appointmentsWithoutCategory.length > 0) {
      // Get a default category or create one
      let defaultCategory = await this.categoryRepository.findOne({
        where: { Name: 'General' }
      });

      if (!defaultCategory) {
        defaultCategory = this.categoryRepository.create({
          Name: 'General'
        });
        await this.categoryRepository.save(defaultCategory);
        console.log('✅ Created default category');
      }

      // Update appointments without categories
      for (const appointment of appointmentsWithoutCategory) {
        appointment.Category = defaultCategory;
        await this.appointmentRepository.save(appointment);
      }

      console.log(`✅ Updated ${appointmentsWithoutCategory.length} appointments with default category`);
    }

    console.log('🎉 Data cleanup completed successfully!');
  }
}
