import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categories } from 'src/categories/entities/categories.entity'; 
import { subscriptions } from 'src/subscription/entities/subscription.entity'; 

@Injectable()
export class InitialDataSeed {
  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,

    @InjectRepository(subscriptions)
    private readonly subscriptionsRepository: Repository<subscriptions>,
  ) {}

  async run() {
    await this.seedCategories();
    await this.seedSubscriptions();
  }

  private async seedCategories() {
    const categoriesData = [
      { Name: 'Plomero' },
      { Name: 'Electricista' },
      { Name: 'Gasista' },
    ];

    for (const data of categoriesData) {
      const exists = await this.categoriesRepository.findOne({ where: { Name: data.Name } });
      if (!exists) {
        const newCategory = this.categoriesRepository.create({
          ...data,
        });
        await this.categoriesRepository.save(newCategory);
      }
    }
    console.log('✅ Categorías sembradas correctamente');
  }

  // Reseed categories: clears table and seeds defaults
  async reseedCategories() {
    // No borrar para evitar violaciones de FK; re-intenta sembrar (upsert por Name)
    await this.seedCategories();
  }

  private async seedSubscriptions() {
    const subscriptionsData = [
      {
        Name: 'Basic',
        Descption: 'Plan básico con 5 servicios mensuales',
        monthlyServices: 5,
        price: 5000,
      },
      {
        Name: 'Standar',
        Descption: 'Plan estándar con 10 servicios mensuales',
        monthlyServices: 10,
        price: 8000,
      },
      {
        Name: 'Premium',
        Descption: 'Plan premium con 15 servicios mensuales',
        monthlyServices: 15,
        price: 12000,
      },
    ];

    for (const data of subscriptionsData) {
      const exists = await this.subscriptionsRepository.findOne({ where: { Name: data.Name } });
      if (!exists) {
        const newSubscription = this.subscriptionsRepository.create({
          ...data,
        });
        await this.subscriptionsRepository.save(newSubscription);
      }
    }
    console.log('✅ Suscripciones sembradas correctamente');
  }
}

