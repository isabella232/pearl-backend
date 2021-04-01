exports.up = function(knex) {
    return knex.schema.raw(`
        ALTER TABLE checkpoints
            ADD COLUMN input_geoms JSONB[];

        ALTER TABLE checkpoints
            RENAME COLUMN geoms TO retrain_geoms;
    `);
  }
  
  exports.down = function(knex) {
    return knex.schema.raw(`
        ALTER TABLE checkpoints
            DROP COLUMN input_geoms;

        ALTER TABLE checkpoints
            RENAME COLUMN retrain_geoms TO geoms;
    `);
  }
  