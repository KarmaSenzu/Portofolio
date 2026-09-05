/**
 * ================================================
 * SUPABASE DATABASE CLIENT CONFIGURATION
 * ================================================
 * Replaces MySQL connection with Supabase PostgreSQL
 * Provides query helpers for common operations
 * ================================================
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// ================================================
// VALIDATE ENVIRONMENT VARIABLES
// ================================================

const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease check your .env file.');
  process.exit(1);
}

// ================================================
// CREATE SUPABASE CLIENT
// ================================================

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for server-side

// Create client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// ================================================
// DATABASE HELPER FUNCTIONS
// ================================================

/**
 * Execute a query and return results
 * @param {string} table - Table name
 * @param {object} options - Query options
 * @returns {Promise<Array>} Query results
 */
async function query(table, options = {}) {
  try {
    let queryBuilder = supabase.from(table).select(options.select || '*');

    // Apply filters
    if (options.where) {
      Object.entries(options.where).forEach(([key, value]) => {
        queryBuilder = queryBuilder.eq(key, value);
      });
    }

    // Apply ordering
    if (options.orderBy) {
      const [column, direction = 'asc'] = options.orderBy.split(' ');
      queryBuilder = queryBuilder.order(column, { ascending: direction === 'asc' });
    }

    // Apply limit
    if (options.limit) {
      queryBuilder = queryBuilder.limit(options.limit);
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Query error on ${table}:`, error);
    throw error;
  }
}

/**
 * Insert a record
 * @param {string} table - Table name
 * @param {object} data - Data to insert
 * @returns {Promise<object>} Inserted record
 */
async function insert(table, data) {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error(`Insert error on ${table}:`, error);
    throw error;
  }
}

/**
 * Update a record
 * @param {string} table - Table name
 * @param {number} id - Record ID
 * @param {object} data - Data to update
 * @returns {Promise<object>} Updated record
 */
async function update(table, id, data) {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error(`Update error on ${table}:`, error);
    throw error;
  }
}

/**
 * Delete a record
 * @param {string} table - Table name
 * @param {number} id - Record ID
 * @returns {Promise<void>}
 */
async function deleteRecord(table, id) {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Delete error on ${table}:`, error);
    throw error;
  }
}

/**
 * Test database connection
 * @returns {Promise<boolean>}
 */
async function testConnection() {
  try {
    // Simple query to test connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }

    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error);
    return false;
  }
}

// ================================================
// EXPORTS
// ================================================

module.exports = {
  supabase,
  query,
  insert,
  update,
  deleteRecord,
  testConnection
};
