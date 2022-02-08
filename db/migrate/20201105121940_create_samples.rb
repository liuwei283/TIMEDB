class CreateSamples < ActiveRecord::Migration[6.0]
  def change
    create_table :samples do |t|
      t.string :sample_name
      t.string :project_name
      t.string :c_tumor_stage
      t.string :c_tumor_grade
      t.string :n_year_of_diagnosis
      t.string  :c_synchronous_malignancy
      t.string :n_cigarettes_per_day
      t.string :c_alcohol_history
      t.string :n_years_smoked
      t.string :n_alcohol_intensity
      t.string :n_weight
      t.string :n_height
      t.string :n_bmi
      t.string :c_race
      t.string :c_gender
      t.string :n_age
      t.string :pfs
      t.string :os
      t.string :pfs_status
      t.string :os_status
      t.string :c_tumor_type
      t.string :platform
 
      t.references :project, null: false, foreign_key: true

      t.timestamps
    end
  end
end
