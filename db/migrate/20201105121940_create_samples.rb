class CreateSamples < ActiveRecord::Migration[6.0]
  def change
    create_table :samples do |t|
      t.string :submitter_id
      t.string :project_name
      t.string :tumor_stage
      t.string :tissue_or_organ_of_origin
      t.integer :days_to_last_follow_up
      t.string :primary_diagnosis
      t.integer :age_at_diagnosis 
      t.string :ajcc_pathologic_t
      t.string :ajcc_pathologic_n
      t.string :ajcc_pathologic_m
      t.string :tumor_grade
      t.string :cigarettes_per_day
      t.integer :years_smoked
      t.string :weight
      t.string :alcohol_intensity
      t.string :height
      t.float :bmi
      t.string :gender 
      t.string :vital_status 
      t.string :race
      t.integer :age_at_index
      t.integer :days_to_death
      t.string :type
      t.float :pfs_status
      t.float :os_status
     
 
      t.references :project, null: false, foreign_key: true

      t.timestamps
    end
  end
end
