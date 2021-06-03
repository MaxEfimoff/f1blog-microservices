import { Sql } from 'node-pg-migrate';
import pg from 'pg';

class Pool {
  _pool = null;

  connect(options) {
    this._pool = new pg.Pool(options);
    return this._pool.query('SELECT 1 + 1;');
  }

  close() {
    return this._pool.end();
  }

  query(sql: string, params?) {
    return this._pool.query(sql, params);
  }
}

const pool = new Pool();

export { pool };