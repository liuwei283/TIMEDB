class CreateSamples < ActiveRecord::Migration[6.0]
  def change
    create_table :samples do |t|
      t.string :sample_name
      t.string :project_name
      t.integer :num_of_oberserved_genes
      t.string :ajcc_pathologic_stage
      t.string :tissue_or_organ_of_origin
      t.string :primary_diagnosis
      t.string :year_of_diagnosis
      t.string :gender
      t.integer :age
      t.string :tumor_stage
      t.string :updated_datetime
      t.string :ethnicity
      t.text :drug_treatment_type
      t.text :treatment_or_therapy
      t.text :site_of_resection_or_biopsy
      t.string :prior_malignancy
      t.string :vital_status
      t.text :synchronous_malignancy
      t.string :morphology
      t.string :ajcc_pathologic_n
      t.string :ajcc_clinical_m
      t.float :os
      t.float :pfs
      t.references :project, null: false, foreign_key: true

      t.timestamps
    end
  end
end
