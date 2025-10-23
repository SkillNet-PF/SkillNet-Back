import { registerAs } from '@nestjs/config';
//import { DataSourceOptions, Migration } from 'typeorm/browser';
//import { DataSource } from 'typeorm/browser';

export default registerAs('typeorm', () => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dropSchema: process.env.NODE_ENV !== 'production',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: true,
  autoLoadEntities: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
}));
//export const connectionSource = new DataSource(config as DataSourceOptions);
