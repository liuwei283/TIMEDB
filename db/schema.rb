# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_11_05_121940) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "deltadb_records", force: :cascade do |t|
    t.integer "kind", default: 0, null: false
    t.json "data"
    t.bigint "deltadb_table_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["deltadb_table_id"], name: "index_deltadb_records_on_deltadb_table_id"
  end

  create_table "deltadb_tables", force: :cascade do |t|
    t.string "name"
    t.json "data"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "projects", force: :cascade do |t|
    t.string "name"
    t.string "project_id1"
    t.string "project_id2"
    t.text "original_description"
    t.text "curated_description"
    t.integer "num_of_samples"
    t.integer "num_of_runs"
    t.integer "population"
    t.text "related_publications"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "samples", force: :cascade do |t|
    t.string "sample_name"
    t.text "original_description"
    t.text "curated_description"
    t.string "project_name"
    t.string "run_id"
    t.string "second_run_id"
    t.string "meta_project_id"
    t.string "experiment_type"
    t.string "nr_reads_sequenced"
    t.string "instrument_model"
    t.string "disease_phenotype"
    t.string "is_disease_stage_available"
    t.string "disease_stage"
    t.text "more"
    t.text "more_info"
    t.string "country"
    t.string "collection_date"
    t.string "sex"
    t.integer "host_age"
    t.string "diet"
    t.string "longitude"
    t.string "lattitude"
    t.float "BMI"
    t.string "associated_phenotype"
    t.string "QC_status"
    t.text "recent_antibiotics_use"
    t.text "antibiotics_used"
    t.text "antibiotics_dose"
    t.integer "days_without_antibiotics_use"
    t.bigint "project_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["project_id"], name: "index_samples_on_project_id"
  end

  add_foreign_key "samples", "projects"
end
