const { Pool } = require('pg');
const PG_URI =
  'postgres://wqwwsdqz:NqDAPzuNW9J0o5eqZuIwyl2f5azOeicv@castor.db.elephantsql.com/wqwwsdqz';

const pool = new Pool({
  connectionString: PG_URI,
});

module.exports = {
  query: async (text: string, params: string, callback: any) => {
    console.log('executed query', text);
    
    const test = await pool.query(text, params, callback);
    return test
  },
};
