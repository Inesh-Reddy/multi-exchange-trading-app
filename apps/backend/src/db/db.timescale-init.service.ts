import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
@Injectable()
export class TimescaleInitService implements OnApplicationBootstrap {
  constructor(private dataSource: DataSource) {}

  async onApplicationBootstrap() {
    await this.dataSource.query(`
      CREATE EXTENSION IF NOT EXISTS timescaledb;
    `);

    const exists = await this.dataSource.query(`
      SELECT * FROM timescaledb_information.hypertables WHERE hypertable_name = 'trades';
    `);

    if (exists.length === 0) {
      await this.dataSource.query(`
        SELECT create_hypertable('trades', 'ts', chunk_time_interval => interval '1 day');
      `);
    }
  }
}

// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { DataSource } from 'typeorm';

// @Injectable()
// export class TimescaleInitService implements OnModuleInit {
//   constructor(private dataSource: DataSource) {}

//   async onModuleInit() {
//     await this.dataSource.query(`
//       CREATE EXTENSION IF NOT EXISTS timescaledb;
//       SELECT create_hypertable('trades', 'ts', chunk_time_interval => interval '1 day', if_not_exists => TRUE);
//     `);
//   }
// }
