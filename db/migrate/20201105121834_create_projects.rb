class CreateProjects < ActiveRecord::Migration[6.0]
  def change
    create_table :projects do |t|
      t.string :project_name
      t.string :c_cancer_name
      t.integer :num_of_samples
      t.string :data_type
      t.string :preprocessed
      t.string :TIMEDB_processing
      t.integer :num_of_oberserved_genes
      t.text :original_description
      t.string :platform
      t.string :submisson_date
      t.string :last_update_date
      t.string :database
      t.string :original_link 
      t.string :major_related_publications
      t.string :publications_link

      t.references :cancer, null:false, foreign_key: true

      t.timestamps
    end
  end
end
