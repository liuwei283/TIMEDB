class CreateSamples < ActiveRecord::Migration[6.0]
  def change
    create_table :samples do |t|
      t.string :sample_name
      t.string :project_name
      t.string :c_tumor_stage
      t.string :c_tumor_grade
      t.string :c_sample_histology
      t.string :c_race
      t.string :c_gender
      t.string :n_age
      t.string :pfs
      t.string :os
      t.string :pfs_status
      t.string :os_status
      t.string :c_tumor_type
      t.string :c_tumor_subtype
      t.string :c_source_name
      t.string :c_treatment
     
      t.references :project, null: false, foreign_key: true

      t.timestamps
    end
  end
end
