# frozen_string_literal: true
# This migration comes from deltadb (originally 20200704123447)

class CreateDeltadbTables < ActiveRecord::Migration[6.0]
  def change
    create_table :deltadb_tables do |t|
      t.string :name
      t.json :data

      t.timestamps
    end

    create_table :deltadb_records do |t|
      t.integer :kind, default: 0, null: false
      t.json :data

      t.belongs_to :deltadb_table

      t.timestamps
    end
  end
end
