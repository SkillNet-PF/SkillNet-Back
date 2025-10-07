import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
//import { DataSourceOptions, Migration } from 'typeorm/browser';
//import { DataSource } from 'typeorm/browser';

dotenvConfig({path: 'env.development'});

const config = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dropSchema: false, // solo dev
  synchronize: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
};

export default registerAs('typeorm', () => config);
//export const connectionSource = new DataSource(config as DataSourceOptions);
